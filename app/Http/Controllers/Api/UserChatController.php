<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consult;
use App\Models\ConsultReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserChatController extends Controller
{
    private function userScope($query, $user): void
    {
        $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id);
            if ($user->email) {
                $q->orWhere(function ($q2) use ($user) {
                    $q2->whereNull('user_id')
                       ->where('email', $user->email)
                       ->whereNotNull('agent_id');
                });
            }
        });
    }

    private function findAndClaim(int $id, $user): ?Consult
    {
        $consult = Consult::where(function ($q) use ($user) {
            $this->userScope($q, $user);
        })->find($id);

        if ($consult && is_null($consult->user_id)) {
            $consult->update(['user_id' => $user->id]);
        }

        return $consult;
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();

        $chats = Consult::with(['agent', 'replies'])
            ->where(function ($q) use ($user) {
                $this->userScope($q, $user);
            })
            ->whereNotNull('agent_id')
            ->withCount('replies')
            ->orderByDesc('updated_at')
            ->get();

        $chats->each(function ($c) use ($user) {
            if (is_null($c->user_id)) {
                $c->update(['user_id' => $user->id]);
            }
        });

        return response()->json(['data' => $chats, 'error' => false, 'message' => null]);
    }

    public function getThread(int $id): JsonResponse
    {
        $user = auth()->user();
        $consult = $this->findAndClaim($id, $user);

        if (!$consult) {
            return response()->json(['error' => true, 'message' => 'Conversation not found.'], 404);
        }

        $consult->load(['agent', 'replies']);

        return response()->json(['data' => $consult, 'error' => false, 'message' => null]);
    }

    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $user = auth()->user();
        $consult = $this->findAndClaim($id, $user);

        if (!$consult) {
            return response()->json(['error' => true, 'message' => 'Conversation not found.'], 404);
        }

        $data = $request->validate(['message' => 'required|string|max:5000']);

        $reply = ConsultReply::create([
            'consult_id' => $consult->id,
            'body'       => $data['message'],
            'sender'     => 'user',
        ]);

        $consult->update(['status' => 'unread']);
        $consult->touch();

        return response()->json(['data' => $reply, 'error' => false, 'message' => 'Message sent.']);
    }

    public function startChat(Request $request): JsonResponse
    {
        $user = auth()->user();
        $data = $request->validate([
            'agent_id' => 'required|integer|exists:re_accounts,id',
            'message'  => 'nullable|string|max:5000',
        ]);

        $existing = Consult::with('agent')
            ->where(function ($q) use ($user) {
                $this->userScope($q, $user);
            })
            ->where('agent_id', $data['agent_id'])
            ->latest()
            ->first();

        if ($existing) {
            if (is_null($existing->user_id)) {
                $existing->update(['user_id' => $user->id]);
            }
            $existing->load('agent');
            return response()->json(['data' => $existing, 'error' => false, 'message' => 'existing']);
        }

        $consult = Consult::create([
            'user_id'    => $user->id,
            'agent_id'   => $data['agent_id'],
            'name'       => $user->name ?? $user->email,
            'email'      => $user->email,
            'content'    => $data['message'] ?? '',
            'status'     => 'unread',
            'ip_address' => $request->ip(),
        ]);

        $consult->load('agent');

        return response()->json(['data' => $consult, 'error' => false, 'message' => 'created'], 201);
    }
}

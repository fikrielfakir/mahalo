<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consult;
use App\Models\ConsultReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserChatController extends Controller
{
    public function index(): JsonResponse
    {
        $userId = auth()->id();
        $chats = Consult::with(['agent', 'replies'])
            ->where('user_id', $userId)
            ->withCount('replies')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json(['data' => $chats, 'error' => false, 'message' => null]);
    }

    public function getThread(int $id): JsonResponse
    {
        $userId = auth()->id();
        $consult = Consult::with(['agent', 'replies'])
            ->where('user_id', $userId)
            ->findOrFail($id);

        return response()->json(['data' => $consult, 'error' => false, 'message' => null]);
    }

    public function sendMessage(Request $request, int $id): JsonResponse
    {
        $userId = auth()->id();
        $consult = Consult::where('user_id', $userId)->findOrFail($id);

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
            ->where('user_id', $user->id)
            ->where('agent_id', $data['agent_id'])
            ->first();

        if ($existing) {
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

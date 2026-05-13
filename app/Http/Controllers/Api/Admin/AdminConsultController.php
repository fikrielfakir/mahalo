<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminConsultController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Consult::query();
        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('email', 'like', "%$s%")->orWhere('phone', 'like', "%$s%"));
        }
        $result = $query->orderBy('created_at', 'desc')->paginate((int) ($request->per_page ?? 15));

        return response()->json([
            'data' => $result->items(),
            'meta' => ['total' => $result->total(), 'last_page' => $result->lastPage(), 'current_page' => $result->currentPage()],
            'error' => false, 'message' => null,
        ]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $c = Consult::findOrFail($id);
        $c->update($request->validate(['status' => 'required|in:read,unread,processing,done']));
        return response()->json(['data' => $c, 'error' => false, 'message' => 'Status updated.']);
    }

    public function destroy(int $id): JsonResponse
    {
        Consult::findOrFail($id)->delete();
        return response()->json(['data' => null, 'error' => false, 'message' => 'Consult deleted.']);
    }

    public function bulkUpdate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids'    => 'required|array',
            'ids.*'  => 'integer',
            'status' => 'required|in:read,unread,processing,done',
        ]);

        Consult::whereIn('id', $data['ids'])->update(['status' => $data['status']]);

        return response()->json(['data' => null, 'error' => false, 'message' => count($data['ids']) . ' consults updated.']);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids'   => 'required|array',
            'ids.*' => 'integer',
        ]);

        Consult::whereIn('id', $data['ids'])->delete();

        return response()->json(['data' => null, 'error' => false, 'message' => count($data['ids']) . ' consults deleted.']);
    }
}

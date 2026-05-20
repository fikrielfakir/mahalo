<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Adresse e-mail invalide.',
            ], 422);
        }

        $email = strtolower(trim($request->email));

        $existing = NewsletterSubscriber::where('email', $email)->first();

        if ($existing) {
            if ($existing->status === 'unsubscribed') {
                $existing->update([
                    'status'            => 'active',
                    'subscribed_at'     => now(),
                    'unsubscribed_at'   => null,
                    'source'            => $request->input('source', 'footer'),
                ]);
                return response()->json([
                    'success' => true,
                    'message' => 'Vous êtes de nouveau inscrit à notre newsletter.',
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'Cette adresse e-mail est déjà inscrite.',
            ], 409);
        }

        NewsletterSubscriber::create([
            'email'         => $email,
            'status'        => 'active',
            'source'        => $request->input('source', 'footer'),
            'subscribed_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie ! Merci de votre abonnement.',
        ], 201);
    }

    public function unsubscribe(Request $request)
    {
        $email = strtolower(trim($request->input('email', '')));
        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if (!$subscriber) {
            return response()->json(['success' => false, 'message' => 'E-mail introuvable.'], 404);
        }

        $subscriber->update([
            'status'          => 'unsubscribed',
            'unsubscribed_at' => now(),
        ]);

        return response()->json(['success' => true, 'message' => 'Vous avez été désinscrit avec succès.']);
    }
}

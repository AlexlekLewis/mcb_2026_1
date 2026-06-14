import { permanentRedirect } from "next/navigation";

// Use a permanent (308) redirect, not the default temporary (307), so Google
// consolidates link equity onto /curtains/theatre-velvet.
export default function VelvetCurtainsRedirectPage() {
    permanentRedirect("/curtains/theatre-velvet");
}

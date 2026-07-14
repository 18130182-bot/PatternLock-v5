const SUPABASE_URL = "https://kcncleosyltuhuaamque.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_hRCu-BxhlUPQcwr0KB3q_Q_00dIKXd1";

window.db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

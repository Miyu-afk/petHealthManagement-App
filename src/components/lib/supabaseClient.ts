import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://flykmsrckfbehomefmha.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZseWttc3Jja2ZiZWhvbWVmbWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzMTYyMDUsImV4cCI6MjA3NTg5MjIwNX0.FdAiNBe1uZtblG2AipvbInadndsy_pUMT-1HPJ5trP0"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

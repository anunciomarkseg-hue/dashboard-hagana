import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ixzbbxmlpyorjjkgbize.supabase.co";
const supabaseKey = "sb_publishable_TNJttq-nw3FKx1E9ih90yQ_9MHnEUId";

export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js'

// Suas chaves do projeto
const supabaseUrl = 'https://cxeihdjniasuxtegypfd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4ZWloZGpuaWFzdXh0ZWd5cGZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTQ4MTYsImV4cCI6MjA3OTA5MDgxNn0.3250oYNEgKIzZMcLcaBt9ncYRvTi-39MZSo1oU-KA8U'

export const supabase = createClient(supabaseUrl, supabaseKey)
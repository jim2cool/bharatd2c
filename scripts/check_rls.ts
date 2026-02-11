import { supabase } from '../lib/supabase-client'

async function checkRLS() {
    const { data, error } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'stores')

    if (error) {
        console.error('Error fetching policies:', error)
        return
    }

    console.log('Stores Policies:', data)
}

checkRLS()

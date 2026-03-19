// Supabase authentication + profile helper.
// Requires: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>
// Set SUPABASE_ANON_KEY with your project's anon key.
(function() {
  const SUPABASE_URL = 'https://nzpniblozownzgizuvus.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56cG5pYmxvem93bnpnaXp1dnVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjE5ODIsImV4cCI6MjA4ODgzNzk4Mn0.2oY8GTW2Q_c4gPU3nbHt9zzSJYDCo0VOTsI0cGzVONk';

  const supabase = window.supabase?.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const ensureClient = () => {
    if (!supabase) {
      console.warn('Supabase no está inicializado. Asegúrate de cargar el script de Supabase antes de auth.js y de configurar la ANON KEY.');
      return false;
    }
    return true;
  };

  const formatError = (err) => {
    if (!err) return 'Ocurrió un error inesperado.';
    const msg = (err.message || err.error_description || String(err)).toString();
    const normalized = msg.toLowerCase();

    if (normalized.includes('invalid login credentials') || normalized.includes('invalid login')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (normalized.includes('password should be at least')) {
      return 'La contraseña debe tener al menos 8 caracteres.';
    }
    if (normalized.includes('user already registered') || normalized.includes('duplicate key value') || normalized.includes('already exists')) {
      return 'Ya existe una cuenta con ese correo.';
    }
    if (normalized.includes('invalid email') || normalized.includes('bad request')) {
      return 'Ingresa un correo válido.';
    }
    if (normalized.includes('password is required') || normalized.includes('password')) {
      return 'Ingresa una contraseña válida.';
    }

    return msg;
  };

  const getUser = async () => {
    if (!ensureClient()) return null;
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  };

  const onAuthChange = (cb) => {
    if (!ensureClient()) return { unsubscribe: () => {} };
    return supabase.auth.onAuthStateChange((event, session) => {
      cb(session?.user ?? null);
    }).subscription;
  };

  const signUp = async (email, password) => {
    if (!ensureClient()) throw new Error('Supabase no está inicializado. Verifica que el script se cargue y que hayas puesto la ANON KEY.');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return await getUser();
  };

  const signIn = async (email, password) => {
    if (!ensureClient()) throw new Error('Supabase no está inicializado. Verifica que el script se cargue y que hayas puesto la ANON KEY.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return await getUser();
  };

  const signOut = async () => {
    if (!ensureClient()) throw new Error('Supabase no está inicializado. Verifica que el script se cargue y que hayas puesto la ANON KEY.');
    await supabase.auth.signOut();
  };

  const getProfile = async () => {
    if (!ensureClient()) return null;
    const user = await getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (error) return null;
    return data;
  };

  const isAdmin = async () => {
    const profile = await getProfile();
    return profile?.role?.toLowerCase() === 'admin';
  };

  const updateProfile = async (updates) => {
    if (!ensureClient()) throw new Error('Supabase no está inicializado. Verifica que el script se cargue y que hayas puesto la ANON KEY.');
    const user = await getUser();
    if (!user) throw new Error('Usuario no autenticado');
    const payload = {
      id: user.id,
      ...updates,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('profiles').upsert(payload);
    if (error) throw error;
    return payload;
  };

  const updatePassword = async (newPassword) => {
    if (!ensureClient()) throw new Error('Supabase no está inicializado. Verifica que el script se cargue y que hayas puesto la ANON KEY.');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  window.Auth = {
    getUser,
    onAuthChange,
    signUp,
    signIn,
    signOut,
    getProfile,
    isAdmin,
    updateProfile,
    updatePassword,
    formatError,
    supabase,
  };
})();

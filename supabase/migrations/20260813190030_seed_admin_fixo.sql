-- Cria a conta fixa de administrador diretamente no Supabase Auth, caso ela
-- ainda não exista. Login: admin@gmail.com  |  Senha: admin@01
-- Os triggers on_auth_user_created e on_auth_user_created_role disparam
-- automaticamente ao inserir em auth.users, criando o perfil em
-- public.profiles e o papel 'admin' em public.user_roles.
DO $$
DECLARE
  novo_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@gmail.com') THEN
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      novo_id,
      'authenticated',
      'authenticated',
      'admin@gmail.com',
      extensions.crypt('admin@01', extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"nome":"Administrador"}',
      now(),
      now(),
      '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider,
      created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(),
      novo_id,
      novo_id::text,
      jsonb_build_object('sub', novo_id::text, 'email', 'admin@gmail.com'),
      'email',
      now(),
      now(),
      now()
    );
  END IF;
END $$;

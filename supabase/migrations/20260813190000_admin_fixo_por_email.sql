-- Substitui a regra "primeiro usuário cadastrado vira admin" por uma
-- regra de e-mail fixo: apenas admin@gmail.com recebe o papel de admin.
-- Todos os demais cadastros continuam recebendo o papel padrão 'user'.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email = 'admin@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Caso já exista algum usuário que virou admin por ter sido o primeiro a se
-- cadastrar (regra antiga) mas cujo e-mail NÃO é admin@gmail.com, remove
-- esse papel para que só a conta fixa de administrador continue com acesso.
DELETE FROM public.user_roles ur
USING auth.users u
WHERE ur.user_id = u.id
  AND ur.role = 'admin'
  AND u.email <> 'admin@gmail.com';

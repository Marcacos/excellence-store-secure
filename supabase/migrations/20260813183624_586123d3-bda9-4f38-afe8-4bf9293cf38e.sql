CREATE POLICY "Imagens de produtos sao visiveis" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'produtos');
CREATE POLICY "Proprietario envia imagens de produtos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Proprietario atualiza imagens de produtos" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Proprietario apaga imagens de produtos" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'produtos' AND public.has_role(auth.uid(), 'admin'));
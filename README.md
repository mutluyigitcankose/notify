# CodexNotify

Next.js 16 tabanli, Turkce tarih mikro-ogrenme ve bildirim uygulamasi.

## PostgreSQL'i Docker ile kaldirma

1. `.env.example` dosyasini `.env.local` olarak kopyalayin.
2. Veritabani konteynerini baslatin:

```bash
npm run db:up
```

3. Drizzle migrationlarini uretin ve uygulayin:

```bash
npm run db:generate
npm run db:migrate
```

4. Uygulamayi calistirin:

```bash
npm run dev
```

## Favori senkronizasyonu

- Her tarayici ilk acilista bir profil oturumu alir.
- Ayarlar sayfasindaki senkron kodu baska bir tarayiciya girilirse ayni favori listesi kullanilir.
- Favori tarihler PostgreSQL uzerinde profil bazli tutulur.

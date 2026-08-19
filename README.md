# surprisefm-alice-skill

Один `server.js` обслуживает пять webhook-адресов для навыков Алисы.

В начале файла находится объект `SKILLS`. Его ключ — часть URL после `/skills/`, `say` — фраза Алисы, `url` — прямая HTTPS-ссылка на аудиопоток.

| Навык | Webhook |
|---|---|
| Surprise.fm | `/skills/surprise` |
| STVOL FM | `/skills/stvol` |
| OTO Radio | `/skills/oto` |
| KURS Radio | `/skills/kurs` |
| PRIVATE PERSONS | `/skills/private-persons` |

Перед запуском замени адреса `replace-me.invalid` в `server.js` на прямые ссылки потоков.

```bash
docker build -t surprisefm-alice-skill .
docker run --rm -p 3000:3000 surprisefm-alice-skill
```

Для каждого навыка укажи свой публичный HTTPS webhook, например `https://alice.example.com/skills/surprise`.

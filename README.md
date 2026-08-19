# surprisefm-alice-skill

Один JavaScript-сервис для пяти отдельных навыков Алисы:

| Навык | Фраза | Docker webhook | Cloud Functions entry point |
|---|---|---|---|
| Surprise.fm | `Включи Surprise.fm` | `/skills/surprise` | `index.surprise` |
| STVOL FM | `Включи STVOL FM` | `/skills/stvol` | `index.stvol` |
| OTO Radio | `Включи OTO Radio` | `/skills/oto` | `index.oto` |
| KURS Radio | `Включи KURS Radio` | `/skills/kurs` | `index.kurs` |
| PRIVATE PERSONS | `Включи PRIVATE PERSONS` | `/skills/private-persons` | `index.privatePersons` |

## 1. Указать прямые stream URL

Никаких переменных окружения для потоков нет.

Открой `stations.js` и замени только эти пять констант:

```js
const SURPRISE_FM_STREAM_URL = "https://replace-me.invalid/surprise-fm";
const STVOL_FM_STREAM_URL = "https://replace-me.invalid/stvol-fm";
const OTO_RADIO_STREAM_URL = "https://replace-me.invalid/oto-radio";
const KURS_RADIO_STREAM_URL = "https://replace-me.invalid/kurs-radio";
const PRIVATE_PERSONS_STREAM_URL = "https://replace-me.invalid/private-persons";
```

Значения `.invalid` специально блокируются приложением. Пока они не заменены, webhook корректно ответит Алисе, что прямой адрес аудиопотока не указан, вместо попытки проиграть несуществующую ссылку.

Нужны именно прямые HTTPS media URL (`.mp3`, `.aac`, HLS `.m3u8` либо streaming endpoint), а не HTML-страницы станции.

### Как достать URL

1. Открой `https://surprise.fm/` в Chrome.
2. DevTools → Network.
3. Включи запись и очисти список.
4. Нажми Play нужного radio channel.
5. Ищи запросы по `media`, `m3u8`, `aac`, `mp3`, `stream`, `radio`.
6. Проверь найденный URL в новой вкладке или через `ffprobe`.
7. Повтори для всех пяти каналов.
8. Запиши ссылки в константы `stations.js`.

## 2. Запуск в Docker

```bash
docker build -t surprisefm-alice-skill .
docker run --rm -p 3000:3000 surprisefm-alice-skill
```

Либо:

```bash
docker compose up -d --build
```

Проверка:

```bash
curl http://localhost:3000/healthz
```

Список навыков:

```bash
curl http://localhost:3000/
```

Тест webhook:

```bash
curl \
  -X POST \
  -H 'Content-Type: application/json' \
  --data @examples/request.json \
  http://localhost:3000/skills/surprise
```

## 3. Пять навыков в Яндекс Диалогах

Создай пять отдельных навыков.

Если контейнер доступен как:

```text
https://alice.example.com
```

укажи backend URL:

```text
https://alice.example.com/skills/surprise
https://alice.example.com/skills/stvol
https://alice.example.com/skills/oto
https://alice.example.com/skills/kurs
https://alice.example.com/skills/private-persons
```

Каждому навыку назначь соответствующее имя/активационную фразу.

## 4. Вариант с Yandex Cloud Functions

Контейнер не обязателен. `index.js` экспортирует пять отдельных обработчиков:

```text
index.surprise
index.stvol
index.oto
index.kurs
index.privatePersons
```

Можно создать пять функций/версий либо использовать код как основу для пяти backend-конфигураций.

## 5. Формат ответа

После замены URL навык формирует:

```json
{
  "version": "1.0",
  "response": {
    "text": "Включаю Surprise.fm",
    "tts": "Включаю Surprise.fm",
    "end_session": true,
    "directives": {
      "audio_player": {
        "action": "Play",
        "item": {
          "stream": {
            "url": "https://DIRECT_STREAM_URL",
            "token": "surprise-fm-live",
            "offset_ms": 0
          }
        }
      }
    }
  }
}
```

> `audio_player` сейчас является экспериментальной частью этого проекта: проверяй фактическое воспроизведение на реальной Станции.

## Тесты

```bash
npm test
```

## Структура

```text
.
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── LICENSE
├── README.md
├── alice.js
├── index.js
├── package.json
├── server.js
├── stations.js
├── examples/
│   └── request.json
└── test/
    ├── alice.test.js
    └── server.test.js
```

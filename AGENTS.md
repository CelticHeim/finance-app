- No agregar comentarios al código
- No usar trycatch en controladores de Laravel
- Todos los response siguen la siguiente estructura:
``` json
{
    "message": "...",
    "data": [ datos ] or { [datos ], [datos ]}
}
```
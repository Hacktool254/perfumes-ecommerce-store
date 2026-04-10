# Ummie's Essence Chatbot Setup

This guide covers setting up the chatbot with Google AI Studio and n8n integration.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Chat Widget    │────▶│  API Route       │────▶│  n8n Webhook    │
│  (Frontend)     │     │  /api/chatbot    │     │  (Port 5678)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                        │
                              ┌────────────────────────┘
                              ▼
                         ┌─────────────────┐
                         │  Google AI      │
                         │  (Gemini Flash) │
                         └─────────────────┘
```

## Current Status

✅ n8n container running on port 5678
✅ Chat widget UI integrated
✅ Backend API route created
✅ Product query functions ready
⏳ Google AI Studio API key needed
⏳ n8n workflow needs configuration

## Setup Steps

### 1. Google AI Studio (Gemini API) - FREE

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key (it's free with generous limits)
3. Copy the key to `.env.local`:
   ```
   GOOGLE_AI_API_KEY=your_actual_key_here
   ```

### 2. n8n Workflow Configuration

The n8n webhook is configured at: `http://localhost:5678/webhook/whatsapp-chatbot`

To access n8n UI:
1. Open http://localhost:5678 in your browser
2. Default credentials should be set (check your n8n setup)
3. Create or import your workflow

#### Expected Workflow Structure

**Webhook Trigger:**
- URL: `/whatsapp-chatbot`
- Method: POST
- Response: JSON with `response` field

**Expected Input:**
```json
{
  "message": "user message text",
  "from": "user@email.com",
  "name": "User Name",
  "sessionId": "session_xxx",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Expected Output:**
```json
{
  "response": "Bot response text",
  "products": [...optional product data...]
}
```

### 3. Test n8n Connection

Run this test command:
```bash
curl -X POST http://localhost:5678/webhook/whatsapp-chatbot \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","from":"test@test.com","name":"Test"}'
```

### 4. Start Development Server

```bash
npm run dev
```

The chat widget will appear on the bottom-right of all customer-facing pages.

## Available Features

### Current
- ✅ Floating chat widget with animations
- ✅ Session persistence (conversation history per session)
- ✅ n8n workflow integration for product queries
- ✅ Fallback responses when services are down
- ✅ Quick action buttons (common queries)
- ✅ Mobile-responsive design

### Planned (Phase 2)
- 🔄 Google AI Studio integration (when API key added)
- 🔄 WhatsApp Business API integration
- 🔄 Direct order placement via chat
- 🔄 Order tracking via chat
- 🔄 Admin chat analytics dashboard

## Environment Variables

```bash
# n8n Configuration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/whatsapp-chatbot
N8N_PRODUCT_QUERY_URL=http://localhost:5678/webhook/whatsapp-chatbot

# Google AI Studio
GOOGLE_AI_API_KEY=your_key_here

# Convex (already configured)
NEXT_PUBLIC_CONVEX_URL=...
```

## Troubleshooting

### n8n not responding
```bash
# Check if container is running
docker ps | grep n8n

# Start n8n
docker start n8n-local

# Check logs
docker logs n8n-local --tail 50
```

### Workflow not found
1. Access n8n UI at http://localhost:5678
2. Create a new workflow
3. Add a Webhook trigger
4. Set path to `whatsapp-chatbot`
5. Add your logic nodes
6. Save and activate

### Chat widget not appearing
Check browser console for errors. Common issues:
- ChatWidget import in layout.tsx
- Build errors in the component

## Database Schema

Chat conversations are logged to `chatbotConversations` table in Convex for analytics.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chatbot` | POST | Main chat endpoint |

## Files Modified/Created

- `apps/web/src/components/chat/chat-widget.tsx` - UI component
- `apps/web/app/api/chatbot/route.ts` - API route
- `convex/chatbotActions.ts` - Convex actions (ready but not activated)
- `convex/schema.ts` - Added chatbotConversations table
- `.env.local` - Added environment variables

## Next Steps

1. ✅ Get Google AI Studio API key
2. ✅ Configure n8n workflow with your product queries
3. ✅ Test the chatbot on the site
4. 🔄 Deploy n8n to AWS (for production)
5. 🔄 Integrate WhatsApp Business API
6. 🔄 Add order placement via chat

## Production Deployment (AWS)

For AWS deployment of n8n:

1. **ECS/Fargate**: Containerized n8n with persistent storage
2. **RDS**: PostgreSQL for n8n database
3. **Secrets Manager**: Store API keys securely
4. **CloudWatch**: Monitor logs and metrics

Example task definition will be provided when ready.

## Support

If you need help configuring the n8n workflow, check:
- n8n docs: https://docs.n8n.io/
- Google AI Studio: https://ai.google.dev/gemini-api/docs
- Convex docs: https://docs.convex.dev/
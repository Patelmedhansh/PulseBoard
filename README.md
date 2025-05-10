# PulseBoard - Enterprise Application Monitoring

![PulseBoard](https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg)

PulseBoard is a modern, real-time application monitoring platform built for enterprise applications. Monitor your applications with precision using our advanced metrics collection and alerting system.

## Features

- 📊 Real-time metrics monitoring
- 🔔 Configurable alerts
- 📈 Beautiful metrics visualization
- 🔒 Enterprise-grade security
- 🚀 Prometheus compatibility
- 📱 Responsive dashboard

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- State Management: Zustand
- Database: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Metrics: Prometheus-compatible
- Charts: Recharts
- 3D Graphics: Three.js + React Three Fiber

## Prerequisites

- Node.js 18+
- Supabase account
- Prometheus server (optional)
- Grafana (optional)

## Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GRAFANA_URL=your_grafana_url  # Optional
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Patelmedhansh/PulseBoard.git
cd PulseBoard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Application Integration

### 1. Metrics Collection

Your application needs to expose metrics in Prometheus format. Example using Node.js:

```javascript
import client from 'prom-client';

// Create metrics
const cpuUsage = new client.Gauge({
  name: 'process_cpu_usage',
  help: 'Process CPU usage'
});

const memoryUsage = new client.Gauge({
  name: 'process_resident_memory_bytes',
  help: 'Process resident memory size in bytes'
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
```

### 2. Prometheus Configuration

Configure Prometheus to scrape your application metrics:

```yaml
scrape_configs:
  - job_name: 'your-app'
    static_configs:
      - targets: ['your-host:port']
    metrics_path: '/metrics'
```

### 3. Alert Configuration

Set up alerts in the PulseBoard dashboard:
- CPU usage thresholds
- Memory usage alerts
- Error rate monitoring
- Custom Prometheus queries

## Development

### Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   └── main.tsx        # Application entry
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
└── public/            # Static assets
```

### Database Migrations

Apply database migrations:

```bash
npx supabase migration up
```

### Edge Functions

Deploy edge functions:

```bash
npx supabase functions deploy
```

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your hosting provider:
```bash
npm run deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email medhanshcloud@gmail.com or join our [Discord community](https://discord.com/invite/KxUFSRkU7j).

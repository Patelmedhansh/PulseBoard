export type Database = {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>;
      };
      metrics: {
        Row: Metric;
        Insert: Omit<Metric, 'id'>;
        Update: Partial<Omit<Metric, 'id'>>;
      };
      alert_configs: {
        Row: AlertConfig;
        Insert: Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AlertConfig, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};

export type Application = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  metrics_endpoint: string;
  status: 'active' | 'inactive' | 'error';
  created_at: string;
  updated_at: string;
};

export type Metric = {
  id: string;
  application_id: string;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  network_rx: number;
  network_tx: number;
};

export type AlertConfig = {
  id: string;
  application_id: string;
  type: 'cpu' | 'memory' | 'error_rate';
  threshold_value: number;
  channel_type: 'webhook' | 'email';
  channel_config: {
    url?: string;
    email?: string;
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
};

export type AuthSession = {
  user: User | null;
  error: Error | null;
  isLoading: boolean;
};
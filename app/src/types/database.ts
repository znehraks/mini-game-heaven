export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          discord_id: string | null;
          nickname: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
          settings: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          discord_id?: string | null;
          nickname: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          settings?: Record<string, unknown>;
        };
        Update: {
          id?: string;
          discord_id?: string | null;
          nickname?: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
          settings?: Record<string, unknown>;
        };
      };
      games: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          thumbnail: string | null;
          max_score: number;
          config: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string | null;
          thumbnail?: string | null;
          max_score?: number;
          config?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          thumbnail?: string | null;
          max_score?: number;
          config?: Record<string, unknown>;
          created_at?: string;
        };
      };
      scores: {
        Row: {
          id: string;
          user_id: string | null;
          game_id: string;
          nickname: string;
          score: number;
          duration_ms: number | null;
          metadata: Record<string, unknown>;
          created_at: string;
          validated: boolean;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          game_id: string;
          nickname: string;
          score: number;
          duration_ms?: number | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          validated?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          game_id?: string;
          nickname?: string;
          score?: number;
          duration_ms?: number | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
          validated?: boolean;
        };
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string;
        };
      };
      notification_queue: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          body: string;
          data: Record<string, unknown>;
          status: string;
          created_at: string;
          processed_at: string | null;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title: string;
          body: string;
          data?: Record<string, unknown>;
          status?: string;
          created_at?: string;
          processed_at?: string | null;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          body?: string;
          data?: Record<string, unknown>;
          status?: string;
          created_at?: string;
          processed_at?: string | null;
          error_message?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row'];
export type Game = Database['public']['Tables']['games']['Row'];
export type Score = Database['public']['Tables']['scores']['Row'];
export type PushSubscription = Database['public']['Tables']['push_subscriptions']['Row'];

export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type GameInsert = Database['public']['Tables']['games']['Insert'];
export type ScoreInsert = Database['public']['Tables']['scores']['Insert'];
export type PushSubscriptionInsert = Database['public']['Tables']['push_subscriptions']['Insert'];
export type NotificationQueue = Database['public']['Tables']['notification_queue']['Row'];
export type NotificationQueueInsert = Database['public']['Tables']['notification_queue']['Insert'];

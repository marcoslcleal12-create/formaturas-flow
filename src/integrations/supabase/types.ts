export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      alunos: {
        Row: {
          album_liberado: boolean | null
          cidade: string | null
          cpf: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          foto_url: string | null
          fotos_liberadas: boolean | null
          id: string
          link_aprovacao_album: string | null
          link_fotos_selecionadas: string | null
          login_usuario: string | null
          nome_completo: string
          prazo_fotos_selecionadas: number | null
          rg: string | null
          status: string
          motivo_inativacao: string | null
          telefone: string | null
          turma_id: string
          updated_at: string
          user_id: string | null
          vencimento_fotos_selecionadas: string | null
          whatsapp: string | null
        }
        Insert: {
          album_liberado?: boolean | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          fotos_liberadas?: boolean | null
          id?: string
          link_aprovacao_album?: string | null
          link_fotos_selecionadas?: string | null
          login_usuario?: string | null
          nome_completo: string
          prazo_fotos_selecionadas?: number | null
          rg?: string | null
          status?: string
          motivo_inativacao?: string | null
          telefone?: string | null
          turma_id: string
          updated_at?: string
          user_id?: string | null
          vencimento_fotos_selecionadas?: string | null
          whatsapp?: string | null
        }
        Update: {
          album_liberado?: boolean | null
          cidade?: string | null
          cpf?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          foto_url?: string | null
          fotos_liberadas?: boolean | null
          id?: string
          link_aprovacao_album?: string | null
          link_fotos_selecionadas?: string | null
          login_usuario?: string | null
          nome_completo?: string
          prazo_fotos_selecionadas?: number | null
          rg?: string | null
          status?: string
          motivo_inativacao?: string | null
          telefone?: string | null
          turma_id?: string
          updated_at?: string
          user_id?: string | null
          vencimento_fotos_selecionadas?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alunos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      contratos: {
        Row: {
          aluno_id: string
          autoriza_imagem: boolean
          created_at: string
          data_contrato: string
          desconto: number
          dia_vencimento: number
          forma_pagamento: string
          id: string
          num_parcelas: number
          observacoes: string | null
          pacote: string
          status: string
          texto_contrato: string | null
          turma_id: string | null
          updated_at: string
          valor_entrada: number
          valor_total: number
        }
        Insert: {
          aluno_id: string
          autoriza_imagem?: boolean
          created_at?: string
          data_contrato?: string
          desconto?: number
          dia_vencimento?: number
          forma_pagamento?: string
          id?: string
          num_parcelas?: number
          observacoes?: string | null
          pacote?: string
          status?: string
          texto_contrato?: string | null
          turma_id?: string | null
          updated_at?: string
          valor_entrada?: number
          valor_total?: number
        }
        Update: {
          aluno_id?: string
          autoriza_imagem?: boolean
          created_at?: string
          data_contrato?: string
          desconto?: number
          dia_vencimento?: number
          forma_pagamento?: string
          id?: string
          num_parcelas?: number
          observacoes?: string | null
          pacote?: string
          status?: string
          texto_contrato?: string | null
          turma_id?: string | null
          updated_at?: string
          valor_entrada?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contratos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          categoria: string
          created_at: string
          data_pagamento: string | null
          descricao: string
          forma_pagamento: string | null
          id: string
          observacao: string | null
          status: string
          turma_id: string | null
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          categoria?: string
          created_at?: string
          data_pagamento?: string | null
          descricao: string
          forma_pagamento?: string | null
          id?: string
          observacao?: string | null
          status?: string
          turma_id?: string | null
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          data_pagamento?: string | null
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          observacao?: string | null
          status?: string
          turma_id?: string | null
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "despesas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      parcelas: {
        Row: {
          contrato_id: string
          created_at: string
          data_pagamento: string | null
          forma_pagamento: string | null
          id: string
          numero: number
          observacao: string | null
          status: string
          updated_at: string
          valor: number
          valor_pago: number
          vencimento: string
        }
        Insert: {
          contrato_id: string
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?: string | null
          id?: string
          numero: number
          observacao?: string | null
          status?: string
          updated_at?: string
          valor?: number
          valor_pago?: number
          vencimento: string
        }
        Update: {
          contrato_id?: string
          created_at?: string
          data_pagamento?: string | null
          forma_pagamento?: string | null
          id?: string
          numero?: number
          observacao?: string | null
          status?: string
          updated_at?: string
          valor?: number
          valor_pago?: number
          vencimento?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcelas_contrato_id_fkey"
            columns: ["contrato_id"]
            isOneToOne: false
            referencedRelation: "contratos"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      turmas: {
        Row: {
          cidade: string | null
          created_at: string
          curso: string
          faculdade: string
          id: string
          nome: string
          observacoes: string | null
          semestre: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cidade?: string | null
          created_at?: string
          curso: string
          faculdade: string
          id?: string
          nome: string
          observacoes?: string | null
          semestre?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cidade?: string | null
          created_at?: string
          curso?: string
          faculdade?: string
          id?: string
          observacoes?: string | null
          nome?: string
          semestre?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "funcionario" | "aluno"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "funcionario", "aluno"],
    },
  },
} as const

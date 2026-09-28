import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  UserRound,
  Wallet,
  FolderKanban,
  Heart,
  PartyPopper,
  Camera,
  ChevronDown,
} from "lucide-react";
import type { ReactNode } from "react";
import { auth } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";


export function AppShell({ children }: { children: ReactNode }) {
  const { isStaff, user } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const signOut = () => {
    auth.sair();
    void navigate({ to: "/auth" });
  };

  const isDemandasActive = currentPath.startsWith("/turmas") || currentPath.startsWith("/demandas");

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar variant="sidebar" collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border p-4">
            <div className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-gold text-accent-foreground">
                <GraduationCap className="size-5" />
              </span>
              <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="font-display text-base font-semibold text-sidebar-foreground">
                  JM Formaturas
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-sidebar-primary">
                  {isStaff ? "Painel de Gestão" : "Área do formando"}
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 py-3">
            {isStaff ? (
              <>
                <SidebarGroup>
                  <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/70">
                    NAVEGAÇÃO
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={currentPath === "/dashboard"}
                          tooltip="VISÃO GERAL"
                        >
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 font-medium tracking-wide"
                          >
                            <LayoutDashboard className="size-4 text-sidebar-primary" />
                            <span>VISÃO GERAL</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          isActive={currentPath.startsWith("/financeiro")}
                          tooltip="FINANCEIRO"
                        >
                          <Link
                            to="/financeiro"
                            className="flex items-center gap-2.5 font-medium tracking-wide"
                          >
                            <Wallet className="size-4 text-sidebar-primary" />
                            <span>FINANCEIRO</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup className="mt-2">
                  <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/70">
                    DEMANDAS
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <Collapsible defaultOpen={isDemandasActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              tooltip="DEMANDAS"
                              isActive={isDemandasActive}
                              className="w-full justify-between font-medium tracking-wide"
                            >
                              <span className="flex items-center gap-2.5">
                                <FolderKanban className="size-4 text-sidebar-primary" />
                                <span>DEMANDAS</span>
                              </span>
                              <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=closed]/collapsible:-rotate-90 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="my-1 space-y-1">
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPath.startsWith("/turmas")}
                                >
                                  <Link
                                    to="/turmas"
                                    className="flex items-center gap-2 font-medium tracking-wide"
                                  >
                                    <Users className="size-4 text-turma-on-ink" />
                                    <span>TURMAS</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>

                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPath === "/demandas/casamento"}
                                >
                                  <Link
                                    to="/demandas/casamento"
                                    className="flex items-center gap-2 font-medium tracking-wide"
                                  >
                                    <Heart className="size-4 text-casamento-on-ink" />
                                    <span>CASAMENTO</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>

                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPath === "/demandas/festa-aniversario"}
                                >
                                  <Link
                                    to="/demandas/festa-aniversario"
                                    className="flex items-center gap-2 font-medium tracking-wide"
                                  >
                                    <PartyPopper className="size-4 text-festa-on-ink" />
                                    <span>FESTA DE ANIVERSÁRIO</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>

                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={currentPath === "/demandas/ensaio"}
                                >
                                  <Link
                                    to="/demandas/ensaio"
                                    className="flex items-center gap-2 font-medium tracking-wide"
                                  >
                                    <Camera className="size-4 text-ensaio-on-ink" />
                                    <span>ENSAIO</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </>
            ) : (
              <SidebarGroup>
                <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/70">
                  FORMANDO
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={currentPath === "/painel"}
                        tooltip="MEU PAINEL"
                      >
                        <Link
                          to="/painel"
                          className="flex items-center gap-2.5 font-medium tracking-wide"
                        >
                          <UserRound className="size-4 text-sidebar-primary" />
                          <span>MEU PAINEL</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center justify-between gap-2 group-data-[collapsible=icon]:justify-center">
              <div className="truncate text-xs group-data-[collapsible=icon]:hidden">
                <p className="truncate font-medium text-sidebar-foreground">{user?.email}</p>
                <p className="text-[10px] text-sidebar-foreground/70">
                  {isStaff ? "Administrador" : "Aluno / Formando"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={signOut}
                title="Sair da conta"
                aria-label="Sair"
                className="size-8 shrink-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">
                {/*  Hierarquia dentro da própria linha: marca na face display,
                     o papel do usuário fica como qualificador secundário.  */}
                <span className="font-display font-semibold text-foreground">JM Formaturas</span>
                <span className="mx-1.5 text-muted-foreground/50" aria-hidden="true">
                  /
                </span>
                {isStaff ? "Painel de Gestão" : "Área do Formando"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-muted-foreground sm:inline-block">
                {user?.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="gap-1.5 text-xs font-medium"
              >
                <LogOut className="size-3.5" />
                <span>Sair</span>
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

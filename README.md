# Formatura Flow

Perfeito. Entendi a lógica do sistema e também analisei o contrato que você anexou. Ele já traz exatamente a estrutura que podemos usar como base para o módulo de contratos: dados do formando, pacote contratado, valor, vencimentos, parcelas, forma de pagamento, cláusulas, autorização de imagem e assinatura eletrônica.

Eu estruturaria o JM Formaturas como um verdadeiro sistema de gestão financeira de formaturas, e não apenas como uma página de cobrança.

1. Estrutura principal

Administrador → Turmas → Formandos → Contratos → Parcelas → Pagamentos

Exemplo:

Turma: Enfermagem – Faculdade X – Formandos 2026/2
→ 20 alunos

Cada aluno terá:

Nome completo

CPF

RG

Data de nascimento

Telefone/WhatsApp

E-mail

Endereço

Login

Senha

Foto de perfil

Status do contrato

Pacote contratado

Valor total

Quantidade de parcelas

Data de vencimento

Valor pago

Valor pendente

Parcelas vencidas

Parcelas futuras

Histórico financeiro

2. Área exclusiva do aluno

Quando o aluno entrar com seu login, ele não deve enxergar nada dos outros alunos.

A tela inicial poderia mostrar:

Olá, Lorena! 👋

Seu contrato

Pacote: Somente Colação de Grau

Valor contratado: R$ 800,00

Pago: R$ 400,00

Em aberto: R$ 400,00

Progresso: 50%

Depois:

Próximo vencimento

30/09/2026
R$ 100,00
[Pagar agora]

E abaixo:

ParcelaVencimentoValorStatusEntrada03/08/2026R$ 400✅ Pago2ª30/09/2026R$ 100🟡 Pendente3ª30/10/2026R$ 100⚪ Futura4ª30/11/2026R$ 100⚪ Futura5ª30/12/2026R$ 100⚪ Futura

No seu contrato de exemplo, a primeira parcela de R$ 400 foi registrada como paga via PIX em 04/08/2026.

3. Central de pagamentos

Aqui entra uma parte muito importante do projeto.

O aluno poderá clicar em Pagar parcela e escolher:

PIX

Cartão de crédito

Cartão de débito

Boleto bancário

O sistema precisa registrar automaticamente:

valor

parcela

data da cobrança

data do pagamento

método utilizado

ID da transação

status

comprovante, quando disponível

taxas da transação

valor líquido recebido

Importante: eu não colocaria simplesmente "gerar uma chave PIX" como se fosse um PIX manual. O ideal é integrar o sistema a um gateway de pagamentos que gere cobrança PIX, cartão e boleto e envie o retorno para o Supabase por webhook.

Assim, quando o pagamento for aprovado, o sistema atualiza automaticamente a parcela para:

✅ PAGO

4. Contrato dentro do usuário

O aluno terá um menu:

📄 Meu Contrato

E poderá:

visualizar o contrato

baixar PDF

visualizar pacote contratado

visualizar valores

visualizar cronograma de parcelas

visualizar cláusulas

visualizar autorização de uso de imagem

visualizar assinatura

acompanhar status da assinatura

Seu contrato atual possui, por exemplo, cláusulas de pagamento e inadimplência, rescisão, prazos de entrega, direitos autorais, uso de imagem, responsabilidade e foro.

Podemos transformar isso em um modelo de contrato dinâmico, onde o sistema preenche automaticamente os dados do aluno.

5. Painel do administrador

Essa será provavelmente a parte mais importante para você.

O dashboard inicial poderia mostrar:

💰 RESUMO GERAL

Total contratado
R$ 250.000,00

Total recebido
R$ 125.000,00

Total a receber
R$ 125.000,00

Inadimplência
R$ 8.500,00

Parcelas vencidas
23

Alunos inadimplentes
12

Turmas ativas
15

6. Dashboard por turma

Você poderá clicar:

Enfermagem – Faculdade X – 2026/2

E visualizar:

20 formandos
R$ 16.000 contratados
R$ 8.400 recebidos
R$ 7.600 a receber
3 inadimplentes

E um ranking:

AlunoContratoPagoPendenteSituaçãoJoãoR$ 800R$ 800R$ 0🟢MariaR$ 800R$ 600R$ 200🟡AnaR$ 800R$ 400R$ 400🔴

Isso vai permitir que você enxergue a saúde financeira da turma inteira em poucos segundos.

7. Dashboard individual

Ao clicar em um aluno:

Lorena Dias da Luz

Você verá:

Dados pessoais

CPF, telefone, WhatsApp, e-mail etc.

Contrato

Pacote contratado: R$ 800

Financeiro

Total: R$ 800
Pago: R$ 400
Pendente: R$ 400
Vencido: R$ 0

Histórico

03/08/2026 — R$ 400
✅ Pago
PIX
Pagamento confirmado em 04/08/2026

30/09/2026 — R$ 100
🟡 Pendente

...

8. Controle de inadimplência

Quero colocar isso como um módulo próprio:

🔴 INADIMPLÊNCIA

Filtros:

Hoje

1–7 dias atrasado

8–15 dias

16–30 dias

+30 dias

Por turma

Por aluno

E cada aluno poderia ter:

3 dias em atraso

Valor:

R$ 100,00

Botão:

📱 Cobrar no WhatsApp

9. Sistema automático de cobrança

Essa parte que você chamou de "disparos na API" pode ficar muito boa.

Por exemplo:

Antes do vencimento

3 dias antes

Olá, {{nome}}! Tudo bem? 😊
Sua parcela do contrato com a JM Formaturas no valor de {{valor}} vence no dia {{vencimento}}.
Para facilitar, você pode realizar o pagamento diretamente pelo seu painel.

No vencimento

Olá, {{nome}}! Sua parcela de {{valor}} vence hoje. Acesse seu painel para realizar o pagamento.

Depois do vencimento

1 dia depois

Olá, {{nome}}. Identificamos que sua parcela de {{valor}} com vencimento em {{data}} ainda não foi identificada como paga. Acesse seu painel para regularizar.

Depois:

3 dias → 7 dias → 15 dias → 30 dias

Tudo configurável pelo administrador.

E você poderá ativar/desativar cada regra.

10. Banco de dados Supabase

Eu criaria aproximadamente estas tabelas:

profiles
turmas
alunos
contratos
pacotes
parcelas
pagamentos
transacoes
cobrancas
mensagens_cobranca
modelos_contrato
assinaturas
documentos
usuarios_admin
configuracoes


E principalmente usaríamos Row Level Security (RLS) no Supabase.

Isso é fundamental.

Um aluno:

aluno_id = 123


só poderá acessar:

seus dados
seu contrato
suas parcelas
seus pagamentos
suas cobranças
seus documentos


Ele jamais poderá consultar os dados de outro aluno simplesmente alterando um ID na URL.

11. Um detalhe muito importante: financeiro

Eu também acrescentaria receitas e despesas.

Você pediu entrada e saída, então o sistema terá:

ENTRADAS

Pagamentos de alunos

PIX

Cartão

Boleto

Outros recebimentos

SAÍDAS

Fornecedores

Impressão

Álbuns

Equipamentos

Transporte

Marketing

Comissões

Outros

Assim você terá:

Receita bruta

− Despesas

= Resultado líquido

E poderá filtrar por:

mês

ano

turma

categoria

forma de pagamento.

12. Também colocaria uma área "Turmas"

Você poderá criar:

+ NOVA TURMA

Exemplo:

Curso: Enfermagem
Faculdade: Faculdade X
Cidade: Araguaína
Semestre: 2026/2
Previsão de formatura: dezembro/2026

Depois:

Adicionar alunos

E poderá cadastrar 20, 30, 50 ou 100 alunos.

13. Importação de alunos

Isso vai economizar MUITO seu tempo.

Além de cadastrar manualmente, quero colocar:

📥 Importar alunos

Você poderá enviar uma planilha Excel:

Nome | CPF | WhatsApp | E-mail | Pacote | Valor


E o sistema cadastra todos automaticamente.

Depois você poderá gerar os acessos dos alunos.

14. Níveis de acesso

Eu faria pelo menos:

👑 SUPER ADMIN

Você.

Acesso total.

👨‍💼 FUNCIONÁRIO

Pode cadastrar alunos, visualizar financeiro etc., mas sem determinadas configurações.

🎓 ALUNO

Apenas seus próprios dados.

15. Identidade visual

O sistema deve se chamar:

JM FORMaturas

E ter uma aparência de empresa profissional de formaturas, não de sistema bancário genérico.

Dashboard moderno, responsivo e funcionando perfeitamente no celular, porque provavelmente o formando vai acessar pelo celular para pagar.

E agora o mais importante: o prompt do Lovable

Eu não faria um prompt pequeno.

Para um projeto desse tamanho, o ideal é entregar ao Lovable uma especificação completa, dizendo:

arquitetura

páginas

banco Supabase

tabelas

relacionamentos

autenticação

RLS

dashboard

financeiro

contratos

pagamentos

webhooks

cobrança automática

permissões

importação Excel

responsividade

integração com API

estrutura de código

regras de negócio.

E eu recomendo construirmos isso em etapas, porque jogar tudo de uma vez no Lovable pode fazer ele criar uma arquitetura bagunçada.

Minha sugestão:

PROMPT 1 — Fundação do sistema

Supabase

autenticação

usuários

turmas

alunos

permissões

RLS

dashboard básico

PROMPT 2 — Financeiro

contratos

pacotes

parcelas

pagamentos

histórico

dashboard financeiro

inadimplência

PROMPT 3 — Área do aluno

login

painel

contrato

parcelas

histórico

central de pagamentos

PROMPT 4 — Gateway de pagamentos

PIX

cartão

boleto

webhooks

confirmação automática

PROMPT 5 — Cobrança automática

WhatsApp/API

lembretes

regras de cobrança

templates

logs

PROMPT 6 — Contratos

geração automática

PDF

assinatura eletrônica

armazenamento

histórico

PROMPT 7 — Gestão empresarial

receitas

despesas

fluxo de caixa

relatórios

exportação

indicadores.

Dessa maneira, vamos construir o JM Formaturas como um sistema realmente profissional e escalável, em vez de simplesmente pedir ao Lovable para "criar um site de pagamentos".

Se você quiser, no próximo passo eu já posso montar o PROMPT 1 COMPLETO, pronto para copiar e colar no Lovable, incluindo a estrutura exata das tabelas do Supabase e as regras de segurança RLS.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://formaturas-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28a57bfb-60ee-4e45-a8fd-fe494aaf5c6b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

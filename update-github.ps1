param (
    [string]$Mensagem = "Atualizacao automatica: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
)

Write-Host "=== Sincronizando com o GitHub ===" -ForegroundColor Cyan

# 1. Verifica se o Git esta instalado
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERRO] O Git nao foi encontrado no PATH. Se acabou de instalar o Git, reinicie o terminal." -ForegroundColor Red
    exit 1
}

# 2. Adiciona todas as alteracoes
Write-Host "-> Adicionando arquivos..." -ForegroundColor Yellow
git add .

# 3. Faz o commit
Write-Host "-> Criando commit com a mensagem: '$Mensagem'..." -ForegroundColor Yellow
git commit -m "$Mensagem"

# 4. Envia para o GitHub (branch main)
Write-Host "-> Enviando alteracoes para o GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCESSO] Projeto atualizado no GitHub com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n[ERRO] Ocorreu um erro ao enviar para o GitHub. Verifique suas credenciais e permissao do repositorio." -ForegroundColor Red
}

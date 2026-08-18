param (
    [string]$Mensagem = "Atualizacao automatica: $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
)

Write-Host "=== Sincronizando com o GitHub ===" -ForegroundColor Cyan

# 1. Localiza o executavel do Git
$gitCmd = "git"
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        $gitCmd = "C:\Program Files\Git\cmd\git.exe"
    } else {
        Write-Host "[ERRO] O Git nao foi encontrado no PATH nem no diretorio padrao. Se acabou de instalar, reinicie o terminal." -ForegroundColor Red
        exit 1
    }
}

# 2. Adiciona todas as alteracoes
Write-Host "-> Adicionando arquivos..." -ForegroundColor Yellow
& $gitCmd add .

# 3. Faz o commit se houver alteracoes
Write-Host "-> Verificando alteracoes para commit..." -ForegroundColor Yellow
& $gitCmd diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "-> Criando commit: '$Mensagem'..." -ForegroundColor Yellow
    & $gitCmd commit -m "$Mensagem"
} else {
    Write-Host "-> Nenhuma alteracao pendente para commit." -ForegroundColor Green
}

# 4. Envia para o GitHub (branch main)
Write-Host "-> Enviando alteracoes para o GitHub (origin main)..." -ForegroundColor Yellow
& $gitCmd push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCESSO] Projeto atualizado no GitHub com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n[AVISO] Nao foi possivel concluir o push. Verifique se o repositorio remoto existe no GitHub e se voce tem permissao de acesso." -ForegroundColor Yellow
}


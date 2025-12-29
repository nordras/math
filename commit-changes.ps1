# Script para fazer commits individuais de cada arquivo modificado
# Uso: .\commit-changes.ps1

Write-Host "🔄 Iniciando commits individuais..." -ForegroundColor Cyan
Write-Host ""

# Array de arquivos e suas mensagens de commit
$commits = @(
    @{
        file = ".env.example"
        message = "fix: atualizar modelo Gemini para gemini-flash-latest

- Substituir gemini-pro descontinuado por gemini-flash-latest
- Atualizar documentação dos modelos disponíveis"
    },
    @{
        file = "generators/aiEnhancer.js"
        message = "feat: melhorar prompt da IA para incluir números na narrativa

- Atualizar modelo padrão para gemini-flash-latest
- Modificar prompt para incluir explicitamente os números do problema
- Adicionar múltiplos exemplos de saída no prompt
- Aumentar limite de palavras de 15 para 20"
    },
    @{
        file = "generators/mathGenerator.js"
        message = "feat: adicionar suporte para exercícios com 3 algarismos

- Adicionar opção threeDigitRatio (25% dos exercícios)
- Implementar geração de números de 3 dígitos (100-999)
- Atualizar generateAddition para aceitar parâmetro useThreeDigits
- Atualizar generateSubtraction para aceitar parâmetro useThreeDigits
- Adicionar tracking de problemas com 3 algarismos nas estatísticas"
    },
    @{
        file = "index.js"
        message = "feat: incluir números nos problemas contextualizados

- Atualizar modelo Gemini padrão para gemini-flash-latest
- Passar números (num1, num2, operation) para problemas contextualizados
- Adicionar exibição de estatísticas de 3 algarismos no console"
    },
    @{
        file = "templates/grid.js"
        message = "feat: reformatar exercícios em lista vertical numerada

- Mudar de grade horizontal para lista vertical (1-50)
- Formato: **N.** num1 ± num2 = ______
- Adicionar estatísticas de problemas com 3 algarismos
- Exibir operação matemática nos problemas contextualizados"
    },
    @{
        file = "adicao-subtracao/exercicio-50-problemas-medium.md"
        message = "docs: atualizar exercício com novo formato de lista vertical"
    },
    @{
        file = "adicao-subtracao/problemas-contextualizados-medium.md"
        message = "docs: atualizar problemas contextualizados com operações matemáticas"
    }
)

# Fazer commit de cada arquivo
foreach ($commit in $commits) {
    Write-Host "📝 Commitando: $($commit.file)" -ForegroundColor Yellow
    
    # Unstage todos os arquivos primeiro
    git reset HEAD . | Out-Null
    
    # Stage apenas o arquivo atual
    git add $commit.file
    
    # Fazer commit
    git commit -m $commit.message
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Commit realizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Erro ao fazer commit!" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "🎉 Todos os commits foram realizados!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Resumo dos commits:" -ForegroundColor Cyan
git log --oneline -7

Write-Host ""
Write-Host "💡 Para enviar ao repositório remoto, execute:" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor White

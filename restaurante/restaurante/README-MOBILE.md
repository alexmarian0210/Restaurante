# SisChef - Web App para celular

O projeto foi adaptado para funcionar como uma aplicação web responsiva, com visual de aplicativo no celular.

## O que foi alterado

- Interface mobile-first e responsiva.
- Navegação inferior no celular.
- Botões maiores para toque.
- Cardápio adaptado para telas pequenas.
- Controle de estoque adaptado para celular.
- Indicador de conexão com o backend.
- Botão para atualizar os dados.
- Feedback de venda por mensagem na tela.
- Manifest PWA.
- Service Worker para cache da interface.
- Ícones do aplicativo.
- Backend configurado para aceitar acesso pela rede local.

## Como abrir no celular pela mesma rede Wi-Fi

1. Inicie o Spring Boot no computador.
2. No Windows, abra o Prompt de Comando e execute:

   `ipconfig`

3. Procure o endereço **IPv4** do computador, por exemplo:

   `192.168.0.15`

4. Conecte o celular na mesma rede Wi-Fi.
5. No navegador do celular, abra:

   `http://192.168.0.15:8080`

Substitua o IP pelo IPv4 real do computador.

### Firewall do Windows

Se o celular não conseguir abrir a página, pode ser necessário permitir o Java na rede privada do Firewall do Windows ou liberar a porta TCP 8080.

## Banco de dados

O aplicativo continua usando o MySQL configurado em:

`src/main/resources/application.properties`

O celular não acessa o MySQL diretamente. O fluxo é:

Celular -> Spring Boot -> MySQL

## Instalação como aplicativo

O projeto já possui suporte a PWA.

Para o navegador oferecer a instalação como aplicativo, normalmente é necessário acessar o sistema em um contexto seguro (HTTPS). O acesso por `http://localhost` também é considerado seguro para desenvolvimento, mas o acesso por IP local via HTTP não atende essa exigência em muitos navegadores.

Depois que o sistema for publicado em um domínio com HTTPS, o usuário poderá adicionar o SisChef à tela inicial e usá-lo com aparência de aplicativo.

## Observação

O `bim/jdk-25_windows-x64_bin.exe` e a pasta `target` não são necessários para executar o projeto com Maven e foram excluídos do pacote final para reduzir o tamanho do arquivo.

| id         | title      |
| :--------- | :--------- |
| brainstorm | Brainstorm |

### Introdução

O brainstorm é uma técnica de elicitação de requisitos que consiste em reunir a equipe e discutir sobre diversos tópicos gerais do projeto. No brainstorm o diálogo é incentivado e críticas são evitadas para permitir que todos colaborem com suas próprias ideias, focando na experiência do usuário e nas funcionalidades da interface.

---

### Metodologia

A equipe se reuniu para debater ideias sobre a interface do projeto via Discord, a sessão começou às 19:00h e terminou às 20:30h, onde um dos membros foi o moderador, direcionando a equipe com questões pré-elaboradas sobre a experiência de uso, e transcrevendo as respostas para o documento.

---

### Brainstorm

#### Versão 1.0

#### Perguntas

**1. Qual o objetivo principal da interface da aplicação?**
1 - A interface deve ser limpa e intuitiva, permitindo que alunos encontrem e agendem monitorias com o mínimo de cliques.
2 - Deve fornecer um dashboard centralizado para o monitor gerenciar seus horários, agendamentos e materiais de apoio.
3 - O objetivo é criar uma experiência de usuário fluida e responsiva, que funcione bem tanto no desktop quanto no celular.
4 - A interface do coordenador deve apresentar dados e relatórios de forma visual e de fácil compreensão.
5 - A plataforma deve conectar visualmente as necessidades de alunos, monitores e coordenadores em um único lugar.

**2. Como será a jornada do usuário (aluno) para agendar uma monitoria?**
1 - O aluno fará login e verá um painel inicial com as disciplinas em que está matriculado.
2 - Ele poderá buscar por disciplina ou pelo nome de um monitor específico.
3 - Ao encontrar um monitor, ele visualizará seu perfil com informações como foto, descrição, horários disponíveis e avaliações.
4 - O aluno clicará em um horário disponível no calendário do monitor para solicitar o agendamento.
5 - Após a confirmação, o agendamento aparecerá no dashboard do aluno, com um link para a sessão (se for online) ou local.

**3. Como a interface do monitor deve funcionar?**
1 - O monitor terá um dashboard principal com a visualização de seus próximos agendamentos e notificações.
2 - Haverá uma seção de "Gerenciar Agenda", onde ele poderá abrir, fechar e editar seus horários disponíveis de forma interativa em um calendário.
3 - O monitor poderá fazer upload de materiais de estudo (PDFs, links) associados a cada disciplina que ele monitora.
4 - Haverá um histórico de sessões realizadas para seu controle de horas.

**4. Que informações o dashboard do coordenador/professor deve exibir?**
1 - Gráficos com o número de monitorias realizadas por semana/mês.
2 - Uma lista das disciplinas com maior e menor procura por monitoria.
3 - Uma tabela com todos os monitores ativos, suas horas registradas e a média de suas avaliações.
4 - Relatórios visuais sobre o feedback dos alunos, mostrando os pontos fortes e fracos do programa.

---

### Requisitos Elicitados

| ID   | Descrição                                                                                                                              |
| :--- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| BS01 | A interface deve permitir que o aluno pesquise e filtre monitores por disciplina.                                                        |
| BS02 | A interface deve exibir uma página de perfil para cada monitor, contendo foto, biografia, disciplinas e calendário de horários.          |
| BS03 | A interface do aluno deve ter um dashboard para visualizar agendamentos futuros e histórico de sessões passadas.                         |
| BS04 | A interface deve fornecer um componente de calendário interativo para o monitor gerenciar sua disponibilidade.                           |
| BS05 | O sistema deve exibir uma notificação ou modal de confirmação visual após um agendamento ser concluído com sucesso.                        |
| BS06 | O monitor deve ter uma interface para fazer upload e gerenciar arquivos de estudo.                                                       |
| BS07 | A interface do coordenador deve apresentar um dashboard com gráficos e métricas chave sobre o uso da plataforma.                         |
| BS08 | O sistema deve incluir um componente para que alunos possam avaliar a monitoria após a sessão.                                           |
| BS09 | Todas as páginas da aplicação devem ser responsivas, adaptando-se a telas de desktop, tablets e smartphones.                              |
| BS10 | A interface deve ter um sistema de login claro e acessível para os três perfis de usuário (aluno, monitor, coordenador).                 |
| BS11 | O painel do monitor deve exibir de forma clara o total de horas realizadas no mês.                                                       |
| BS12 | A interface de busca deve retornar resultados de forma rápida e apresentar os monitores em cards fáceis de ler.                           |
| BS13 | O sistema deve ter uma paleta de cores e tipografia consistentes em todas as telas, seguindo uma identidade visual definida.            |
| BS14 | A interface deve incluir elementos de feedback para o usuário, como loaders durante o carregamento de dados e mensagens de erro amigáveis. |
| BS15 | O fluxo de agendamento deve ser realizado em, no máximo, 4 passos para garantir uma boa experiência de usuário.                             |

---

### Conclusão

Através da aplicação da técnica de brainstorm, foi possível elicitar os primeiros requisitos funcionais e de interface do projeto, garantindo um foco claro na experiência do usuário e nas necessidades visuais e interativas da plataforma.

---

## Referências Bibliográficas
BARBOSA, S. D. J; DA SILVA, B. S. Interação humano-computador. Elsevier, 2010.

---

### Autor(es)

| Data       | Versão | Descrição            | Autor(es)       |
| :--------- | :----- | :------------------- | :-------------- |
| 30/09/2025 | 1.0    | Criação do documento | Bernardo Miller e Gianluca |

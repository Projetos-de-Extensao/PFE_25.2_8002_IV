# Funcionalidades do Sistema

Nesta seção, detalhamos as principais funcionalidades implementadas no Front-end do sistema de Gestão de Monitores.

# 1. Autenticação e Segurança (Login)
Para garantir a segurança dos dados, o acesso ao sistema é restrito.
* **Tela de Login:** O usuário (coordenador ou administrador) deve inserir suas credenciais para acessar o painel.
* **Objetivo:** Impedir que usuários não autorizados alterem alocações ou dados dos alunos.

# 2. Gestão de Monitores (CRUD)
O núcleo do sistema é o gerenciamento do cadastro dos alunos monitores.
* **Listagem:** Visualização rápida de todos os monitores cadastrados, com dados essenciais (Nome, Matrícula, Curso).
* **Cadastro:** Formulário para adicionar novos monitores ao sistema.
* **Edição/Remoção:** Permite atualizar dados de contato ou remover monitores que não fazem mais parte do quadro.

# 3. Controle de Alocação
Esta funcionalidade resolve o principal problema da coordenação: saber "quem está onde".
* **Vínculo:** Interface para associar um **Monitor** a uma **Disciplina** específica.
* **Organização:** Evita conflitos de horários e garante que todas as disciplinas demandadas tenham suporte.

# 4. Interface Responsiva
Todo o Front-end foi construído pensando na usabilidade.
* O layout se adapta a diferentes tamanhos de tela (embora o foco principal seja o uso Desktop para gestão administrativa).
* Uso de componentes visuais claros (botões, tabelas e modais) para facilitar a navegação.

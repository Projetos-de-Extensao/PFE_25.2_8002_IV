# Modelo de Dados (Entidades)

Embora o sistema seja um Front-end, ele foi desenhado pensando em uma estrutura de dados lógica. Abaixo descrevemos as principais "Entidades" que o sistema manipula.

# 1. Monitor
Representa o aluno que prestará a monitoria.
* **Campos Principais:**
    * Nome Completo
    * Matrícula (ID)
    * Email de Contato
    * Curso (Ex: Engenharia, Economia)

# 2. Disciplina
Representa a matéria que necessita de apoio.
* **Campos Principais:**
    * Nome da Disciplina (Ex: Cálculo I, Algoritmos)
    * Código da Turma

# 3. Alocação
É a entidade que liga o Monitor à Disciplina.
* **Função:** Determina que o *Monitor X* é responsável pela *Disciplina Y* naquele período.

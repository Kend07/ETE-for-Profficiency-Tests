/* ==========================================================================
   ETE for Proficiency Tests — Inglés V (IDTEC05) Quiz Logic
   --------------------------------------------------------------------------
   Motor del quiz interactivo basado en el Syllabus oficial de la UTN
   (Semanas 1-6 y 8-13). Incluye:
   - Datos de los 12 bloques de contenido (2 ejercicios por semana).
   - Render de ejercicios (selección única + respuesta corta).
   - Evaluación de "intención comunicativa" por criterios + autoevaluación.
   - Seguimiento de progreso y reporte final integrador.

   Nota de seguridad: estas funciones se exponen como globales para los
   manejadores onclick declarativos del HTML (uso interno del proyecto).
   ========================================================================== */

    /* ------------------------------------------------------------------------
       showToast — notificaciones con Toastify (CDN)
       Tipos: 'info', 'success', 'warning', 'error'. Si el CDN de Toastify no
       cargó, cae a window.alert para no romper el flujo del quiz.
       ------------------------------------------------------------------------ */
    function showToast(message, type = 'info') {
      const palette = {
        info: 'linear-gradient(to right, #0056B3, #003366)',
        success: 'linear-gradient(to right, #16a34a, #15803d)',
        warning: 'linear-gradient(to right, #d97706, #b45309)',
        error: 'linear-gradient(to right, #dc2626, #b91c1c)'
      };

      if (typeof Toastify === 'undefined') {
        window.alert(message);
        return;
      }

      Toastify({
        text: message,
        duration: 3500,
        gravity: 'top',
        position: 'right',
        style: { background: palette[type] || palette.info }
      }).showToast();
    }

    // DATA STRUCTURE FOR THE 12 CONTENT WEEKS (2 exercises each)
    const quizData = [
      {
        week: 1,
        title: "Semana 1: Expressing Beliefs, Opinions, Agreement & Disagreement",
        outcome: "Expresar opiniones, acuerdo y desacuerdo de manera educada en el entorno laboral.",
        mc: {
          id: "w1_mc",
          question: "Your colleague states: 'I don't think we should schedule meetings on Friday afternoons.' You agree with their negative statement. Which response is correct and natural?",
          options: [
            { text: "So do I.", isCorrect: false, rationale: "'So do I' is used to agree with positive statements (e.g., 'I like tea')." },
            { text: "Neither do I.", isCorrect: true, rationale: "'Neither do I' or 'Nor do I' is the correct formula to agree with a negative statement in English." },
            { text: "I am agree.", isCorrect: false, rationale: "'Agree' is a verb in English, so 'I agree' is used instead of 'I am agree'." },
            { text: "Neither I do.", isCorrect: false, rationale: "The word order must be 'Neither + auxiliary verb + subject' (Neither do I)." }
          ],
          hint: "Remember the rule: Agree with negative statements using Nor/Neither + auxiliary + pronoun."
        },
        sa: {
          id: "w1_sa",
          prompt: "Context: A coworker suggests working extra hours on Saturday night to finish a project. Express a polite disagreement and briefly give your reason.",
          keyCriteria: ["Polite disagreement phrase (e.g., I'm afraid I can't agree, I don't think that's a good idea, I see your point but...)", "Reason/Justification (e.g., work-life balance, prior plans, burnout)"],
          sampleAnswer: "I'm afraid I can't agree with you there. I understand we have a deadline, but working Saturday night will exhaust the team.",
          keywords: ["disagree", "agree", "afraid", "don't think", "understand", "but", "however", "reason", "because", "time", "plans", "weekend"]
        }
      },
      {
        week: 2,
        title: "Semana 2: Factual Information & Offering Advice in Pluricultural Contexts",
        outcome: "Transmitir información factual sencilla y ofrecer consejos constructivos en el trabajo.",
        mc: {
          id: "w2_mc",
          question: "Which sentence provides clear, objective factual information and advice while maintaining cultural sensitivity?",
          options: [
            { text: "You must change your entire method immediately because it makes no sense.", isCorrect: false, rationale: "Too confrontational and aggressive for a professional/pluricultural setting." },
            { text: "Taking into account our project deadline, I suggest we review the technical documentation together.", isCorrect: true, rationale: "Uses professional advice linking phrases ('taking into account', 'I suggest') respectfully and objectively." },
            { text: "If I were you I would just quit because the manager is wrong.", isCorrect: false, rationale: "Unprofessional and subjective advice." },
            { text: "Keep in mind that you don't know how to use the equipment properly.", isCorrect: false, rationale: "Lacks constructive tone and empathy." }
          ],
          hint: "Look for phrases that use 'taking into account' or 'consider' with a constructive tone."
        },
        sa: {
          id: "w2_sa",
          prompt: "Context: A newly hired developer from another country is stressed about missing project deadlines due to unfamiliar software tools. Give them constructive advice.",
          keyCriteria: ["Constructive advice phrase (e.g., You should, I recommend, Keep in mind that, Have you considered...)", "Focus on solution/factual support (e.g., training, asking team, documentation)"],
          sampleAnswer: "Keep in mind that learning new tools takes time. I recommend checking our documentation or scheduling a quick training session with the team.",
          keywords: ["should", "recommend", "suggest", "keep in mind", "consider", "help", "training", "documentation", "time", "try", "ask"]
        }
      },
      {
        week: 3,
        title: "Semana 3: Making Notes & Handling Routine Instructions / Phone Messages",
        outcome: "Tomar notas con información relevante de llamadas y reuniones de trabajo.",
        mc: {
          id: "w3_mc",
          question: "When taking a professional phone message for a coworker who is unavailable, which set of details is essential to note down?",
          options: [
            { text: "Caller's full personal opinion, general weather, time of call.", isCorrect: false, rationale: "Irrelevant details for a work message." },
            { text: "Caller's name, phone number, main topic/action item, and time of call.", isCorrect: true, rationale: "Concise, actionable, and covers essential contact + topic requirements." },
            { text: "Word-for-word transcript of everything said during the call.", isCorrect: false, rationale: "Note-taking requires summarizing key points, not transcribing every word." },
            { text: "Only the caller's phone number without any name or context.", isCorrect: false, rationale: "Incomplete and unhelpful for the recipient." }
          ],
          hint: "Effective note-taking focuses on caller identity, contact number, and specific action items."
        },
        sa: {
          id: "w3_sa",
          prompt: "Context: Mr. Jones called at 10:15 AM regarding a system bug in the login module. He wants Sarah to call him back before 2:00 PM at 8888-5555. Write a short, structured message note for Sarah.",
          keyCriteria: ["Identify caller & time (Mr. Jones, 10:15 AM)", "Identify action & deadline (Call back regarding login bug before 2:00 PM)", "Contact number (8888-5555)"],
          sampleAnswer: "Caller: Mr. Jones (10:15 AM)\nTopic: System bug in login module\nAction: Please call back at 8888-5555 before 2:00 PM.",
          keywords: ["Jones", "call", "phone", "bug", "login", "module", "time", "2:00", "8888-5555", "message", "before"]
        }
      },
      {
        week: 4,
        title: "Semana 4: Online Work Postings, Experiences & Responding to Comments",
        outcome: "Publicar sobre experiencias/eventos laborales en redes profesionales y responder comentarios.",
        mc: {
          id: "w4_mc",
          question: "You posted on LinkedIn about finishing a tough cybersecurity certification. A connection comments: 'Great achievement! How long did it take you to prepare?' How should you respond professionally?",
          options: [
            { text: "Thank you for your kind words! It took me about three months of studying.", isCorrect: true, rationale: "Expresses gratitude politely, answers the specific question, and maintains a positive professional tone." },
            { text: "Why are you asking me that?", isCorrect: false, rationale: "Defensive and rude for professional social media interaction." },
            { text: "I felt overwhelmed and stressed every single day.", isCorrect: false, rationale: "Does not answer the commenter's question or engage constructively." },
            { text: "I posted this for my boss only.", isCorrect: false, rationale: "Inappropriate tone for social media engagement." }
          ],
          hint: "A good response acknowledges feedback warmly and answers the question directly."
        },
        sa: {
          id: "w4_sa",
          prompt: "Context: Write a short social media post (2 sentences) sharing a positive work experience (e.g., completing a software project, attending a conference) and expressing how you felt.",
          keyCriteria: ["Describe a work experience/event (project, seminar, milestone)", "Express an emotion/feeling (proud, energized, excited, grateful, challenged)"],
          sampleAnswer: "I am thrilled to announce that our team successfully launched the new mobile application today! It was a challenging journey, but I feel very proud of our hard work.",
          keywords: ["excited", "thrilled", "proud", "happy", "grateful", "project", "team", "launched", "completed", "work", "event", "conference"]
        }
      },
      {
        week: 5,
        title: "Semana 5: Making Complaints & Requesting Returns or Product Differences",
        outcome: "Presentar una queja formal sobre compras/equipos defectuosos y solicitar cambios o reembolsos.",
        mc: {
          id: "w5_mc",
          question: "Which sentence represents a polite yet firm formal complaint about delivered hardware?",
          options: [
            { text: "Your company is terrible and your service is worthless.", isCorrect: false, rationale: "Too emotional and aggressive; fails professional communication standards." },
            { text: "I am writing to complain about the computers we received yesterday, which do not match our order specifications.", isCorrect: true, rationale: "Polite, clear, uses formal complaint structure ('I am writing to complain about') and a relative clause ('which do not match')." },
            { text: "Maybe there is a problem, but it doesn't matter much.", isCorrect: false, rationale: "Fails to state a complaint or demand resolution." },
            { text: "Give me my money back right now!", isCorrect: false, rationale: "Demanding and informal without explaining the issue." }
          ],
          hint: "Formal complaints state the issue clearly using phrases like 'I am writing to complain about...' or 'There seems to be an issue with...'."
        },
        sa: {
          id: "w5_sa",
          prompt: "Context: The 5 laptops delivered to your office have cracked screens. Write a short complaint email sentence to the supplier stating the problem and requesting a replacement or refund.",
          keyCriteria: ["State the complaint clearly (cracked screens / faulty laptops)", "Request specific action (replacement, refund, exchange)"],
          sampleAnswer: "I am afraid there is a serious problem with the laptops delivered today, as the screens are cracked. We request an immediate replacement for these faulty items.",
          keywords: ["complain", "problem", "faulty", "damaged", "broken", "cracked", "laptops", "replace", "replacement", "refund", "exchange", "request"]
        }
      },
      {
        week: 6,
        title: "Semana 6: Reading Comprehension - Main Ideas & Supporting Details in Memos/Policies",
        outcome: "Comprender la idea principal y detalles en textos laborales (memorandos, políticas, correos).",
        mc: {
          id: "w6_mc",
          question: "Read the memo excerpt: 'Starting next month, all employees may choose to work remotely on Mondays and Fridays. However, core hours must be kept between 9 AM and 3 PM.' What is the MAIN idea?",
          options: [
            { text: "Employees must work from the office every Friday.", isCorrect: false, rationale: "Contradicts the text which allows remote work on Fridays." },
            { text: "The company is introducing a flexible remote work policy on Mondays and Fridays.", isCorrect: true, rationale: "Accurately summarizes the central purpose/main idea of the memo." },
            { text: "Core hours are strictly from 8 AM to 5 PM.", isCorrect: false, rationale: "Inaccurate detail; the text states 9 AM to 3 PM." },
            { text: "Remote work is mandatory for all workers indefinitely.", isCorrect: false, rationale: "The policy states employees 'may choose', not that it is mandatory." }
          ],
          hint: "The main idea answers 'What is the primary message of this entire announcement?'"
        },
        sa: {
          id: "w6_sa",
          prompt: "Read this snippet: 'All technical staff must complete the mandatory cybersecurity training module by August 30th to ensure compliance with company data protection policies.' Summarize the main point in 1 sentence.",
          keyCriteria: ["Mention topic (cybersecurity training module)", "Mention requirement/deadline (mandatory for technical staff / complete by Aug 30)"],
          sampleAnswer: "Technical staff are required to complete a mandatory cybersecurity training module before August 30th.",
          keywords: ["technical", "staff", "cybersecurity", "training", "module", "complete", "mandatory", "August 30", "policy", "must", "required"]
        }
      },
      {
        week: 8,
        title: "Semana 8: Describing Professional Dreams, Hopes & Ambitions",
        outcome: "Describir metas, sueños y ambiciones profesionales con estructuras de futuro/esperanza.",
        mc: {
          id: "w8_mc",
          question: "Which sentence correctly expresses a future professional ambition using appropriate grammar?",
          options: [
            { text: "I dream to becoming a senior software architect next year.", isCorrect: false, rationale: "Grammar error: 'dream of becoming' or 'hope to become' is correct." },
            { text: "My main ambition is to lead an international IT project within the next three years.", isCorrect: true, rationale: "Correct structure ('My ambition is to + infinitive') and clear career objective." },
            { text: "I wish I am the CEO right now.", isCorrect: false, rationale: "Incorrect tense with 'wish' (should be 'I wish I were/could be')." },
            { text: "I hope I will passed the certification exam.", isCorrect: false, rationale: "Incorrect verb form after modal 'will' (should be 'will pass')." }
          ],
          hint: "Look for patterns like 'My ambition is to + verb', 'I hope to + verb', or 'It is my goal to + verb'."
        },
        sa: {
          id: "w8_sa",
          prompt: "Context: You are creating a professional career vision statement. Express one ambition you have for your career in technology and what you hope to achieve.",
          keyCriteria: ["Express professional ambition (e.g., My goal is to, I hope to, My ambition is to, I'd like to)", "State technology/work area objective"],
          sampleAnswer: "It is my goal to become a certified cloud security expert. I hope to design secure infrastructure for global tech companies.",
          keywords: ["hope", "ambition", "goal", "dream", "aim", "like to", "become", "work", "lead", "promote", "achieve", "project"]
        }
      },
      {
        week: 9,
        title: "Semana 9: Understanding Personal & Professional Correspondence (Emails/Letters)",
        outcome: "Comprender y responder correspondencia laboral, identificando fórmulas formales/informales y acrónimos.",
        mc: {
          id: "w9_mc",
          question: "An email ends with: 'Please find attached the updated database specs. FYI, the meeting was moved to 3 PM. I look forward to hearing from you. Sincerely, Mark.' What does 'FYI' mean and what is the tone?",
          options: [
            { text: "For Your Information / Formal business tone.", isCorrect: true, rationale: "'FYI' stands for 'For Your Information', commonly used in business emails to share quick background details." },
            { text: "For Your Inspection / Informal personal letter.", isCorrect: false, rationale: "Incorrect acronym meaning." },
            { text: "From Your Initiative / Urgent complaint.", isCorrect: false, rationale: "Incorrect acronym meaning and wrong tone interpretation." },
            { text: "Final Yearly Inspection / Casual chat.", isCorrect: false, rationale: "Incorrect acronym meaning." }
          ],
          hint: "FYI is a standard professional shorthand for sharing useful knowledge."
        },
        sa: {
          id: "w9_sa",
          prompt: "Context: A customer sends an email asking: 'Could you please confirm if my registration for the IT Conference was received?' Write a short, formal confirmation email response.",
          keyCriteria: ["Formal greeting and closing (Dear..., Best regards / Sincerely)", "Clear confirmation of registration"],
          sampleAnswer: "Dear Client,\nThank you for reaching out. I am pleased to confirm that your registration for the IT Conference has been received.\nBest regards,\nSupport Team",
          keywords: ["confirm", "received", "registration", "thank", "dear", "regards", "sincerely", "pleased", "inform", "conference"]
        }
      },
      {
        week: 10,
        title: "Semana 10: Expressing Opinions & Justifying Perspectives on Everyday Work Life",
        outcome: "Expresar puntos de vista sobre situaciones laborales diarias justificando con razones y conectores.",
        mc: {
          id: "w10_mc",
          question: "Which option best expresses an opinion and justifies it using a cause/reason connector?",
          options: [
            { text: "I like the new software because it is blue.", isCorrect: false, rationale: "Lacks professional justification and substance." },
            { text: "I'd say that updating our servers is essential owing to recent system delays.", isCorrect: true, rationale: "Uses opinion phrase ('I'd say that') and justification connector ('owing to') in a professional context." },
            { text: "In my opinion, we should stop working completely.", isCorrect: false, rationale: "Unreasonable opinion without logical justification." },
            { text: "Although we upgraded, we failed.", isCorrect: false, rationale: "'Although' shows contrast, not justification." }
          ],
          hint: "Look for opinion phrases paired with justification connectors like 'because of', 'due to', or 'owing to'."
        },
        sa: {
          id: "w10_sa",
          prompt: "Context: Your company wants to adopt Artificial Intelligence tools for daily task automation. Express your opinion on this idea and justify your perspective with at least one reason.",
          keyCriteria: ["Opinion phrase (e.g., In my opinion, I strongly believe, As far as I know, I'd say that)", "Justification/Reason connector (e.g., because, due to, since, because of)"],
          sampleAnswer: "I strongly believe that adopting AI tools is a great decision because it will reduce routine administrative work and increase our productivity.",
          keywords: ["opinion", "believe", "think", "feel", "because", "due to", "since", "reason", "improve", "productivity", "efficiency", "save time"]
        }
      },
      {
        week: 11,
        title: "Semana 11: Understanding Short Talks, Presentations & Polite Interruptions",
        outcome: "Comprender presentaciones de trabajo, interrumpir de forma educada y solicitar aclaraciones.",
        mc: {
          id: "w11_mc",
          question: "During a technical conference, a speaker presents complex data too quickly. What is the most polite way to interrupt and request clarification?",
          options: [
            { text: "Stop talking! I don't understand anything.", isCorrect: false, rationale: "Rude and highly unprofessional." },
            { text: "Sorry to interrupt, but could I make a point here? Are you saying that the server failed due to overload?", isCorrect: true, rationale: "Uses professional interruption formula ('Sorry to interrupt...') and clarification check ('Are you saying that...?')." },
            { text: "You are wrong about those numbers.", isCorrect: false, rationale: "Confrontational and does not request clarification." },
            { text: "I don't get it, repeat everything.", isCorrect: false, rationale: "Demanding tone without polite framing." }
          ],
          hint: "Phrases like 'Sorry to interrupt, but...' or 'Could I come in here?' maintain professional etiquette."
        },
        sa: {
          id: "w11_sa",
          prompt: "Context: During a team meeting, your colleague explains a new workflow, but the timeline isn't clear to you. Write a polite phrase asking for clarification.",
          keyCriteria: ["Polite interruption or clarification request (e.g., Excuse me, Do you mean that, If I understand correctly, Could you clarify)"],
          sampleAnswer: "Sorry to interrupt, but if I understand correctly, are you saying the deadline for the new workflow is next Monday?",
          keywords: ["sorry", "interrupt", "clarify", "mean", "understand", "correctly", "saying", "explain", "could", "would"]
        }
      },
      {
        week: 12,
        title: "Semana 12: Asking Co-workers How Things Work & Encouraging Participation",
        outcome: "Preguntar el razonamiento detrás de las ideas de los compañeros e invitar al equipo a participar.",
        mc: {
          id: "w12_mc",
          question: "You want to know why a team member thinks a new database architecture will work, while also inviting others to share their views. Which approach is best?",
          options: [
            { text: "Why do you think this architecture will work? Let's hear what everyone else thinks about it too.", isCorrect: true, rationale: "Asks for reasoning ('Why do you think... will work?') and uses inclusive language to encourage team participation." },
            { text: "Your idea won't work, right?", isCorrect: false, rationale: "Leading tag question with a negative, discouraging tone." },
            { text: "Tell me your idea now.", isCorrect: false, rationale: "Imperative and abrupt; does not invite team discussion." },
            { text: "Does anyone care about this?", isCorrect: false, rationale: "Dismissive and unprofessional." }
          ],
          hint: "Combine a direct/indirect question about functionality with inclusive phrases like 'What do you all think?'."
        },
        sa: {
          id: "w12_sa",
          prompt: "Context: A coworker proposes implementing a new cloud storage system. Write a message asking them how they expect it to work and inviting the rest of the team to comment.",
          keyCriteria: ["Ask for operational reasoning (How do you see this working? / What is the reasoning behind...)", "Invite team participation (What are your thoughts, team? / Would anyone else like to join?)"],
          sampleAnswer: "Could you explain how you see this cloud storage system working for our daily backups? Also, I'd love to hear what the rest of the team thinks about this proposal.",
          keywords: ["how", "work", "reasoning", "think", "team", "everyone", "opinion", "thoughts", "share", "view", "join"]
        }
      },
      {
        week: 13,
        title: "Semana 13: Composing Factual Business Emails & Asking/Giving Confirmation",
        outcome: "Redactar correos/cartas laborales de naturaleza factual para solicitar información o confirmar detalles.",
        mc: {
          id: "w13_mc",
          question: "You are writing a factual email to confirm a meeting schedule and add a question tag. Which sentence is grammatically and professionally correct?",
          options: [
            { text: "You are going to attend the project briefing tomorrow, aren't you?", isCorrect: true, rationale: "Uses a clear factual statement combined with the correct question tag ('are going... aren't you?')." },
            { text: "You attend the briefing, don't you going?", isCorrect: false, rationale: "Incorrect question tag formation." },
            { text: "With reference to your letter, you didn't came, did you?", isCorrect: false, rationale: "Grammar error: 'didn't come' (base verb needed after auxiliary 'didn't')." },
            { text: "Confirm me the meeting now.", isCorrect: false, rationale: "Inappropriate command format for business email." }
          ],
          hint: "Question tags match the auxiliary verb and tense of the main sentence (positive statement + negative tag)."
        },
        sa: {
          id: "w13_sa",
          prompt: "Context: Draft a short factual email (2-3 sentences) to a vendor requesting the invoice details for last week's software licenses and asking for email confirmation.",
          keyCriteria: ["Factual request phrase (With reference to..., I am writing to request...)", "Request for confirmation / Invoice details"],
          sampleAnswer: "Dear Vendor,\nWith reference to our recent order, could you please send us the detailed invoice for last week's software licenses?\nAdditionally, please reply to confirm once the payment terms are finalized.\nBest regards,",
          keywords: ["request", "invoice", "details", "confirm", "confirmation", "reference", "software", "licenses", "regards", "send", "please"]
        }
      }
    ];

    // USER PROGRESS TRACKING
    let userAnswers = {};

    // PERSISTENCIA DE PROGRESO (localStorage): las respuestas sobreviven a
    // recargas y visitas, y el quiz se marca como completado al terminarlo.
    const STORAGE_KEY = 'ete_quiz_progress_ingles_v';

    function loadProgress() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { userAnswers: {}, completed: false };
        const data = JSON.parse(raw);
        return {
          userAnswers: data.userAnswers && typeof data.userAnswers === 'object' ? data.userAnswers : {},
          completed: !!data.completed
        };
      } catch (e) {
        return { userAnswers: {}, completed: false };
      }
    }

    function saveProgress() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ userAnswers, completed: isQuizCompleted() }));
      } catch (e) {
        // Almacenamiento no disponible (p. ej. modo privado): se continúa sin persistir.
      }
    }

    function getCompletedCounts() {
      let completed = 0;
      let mcCorrect = 0;
      let saAchieved = 0;
      quizData.forEach(item => {
        const mcAns = userAnswers[item.mc.id];
        if (mcAns !== undefined) {
          completed++;
          if (mcAns.isCorrect) mcCorrect++;
        }
        const saAns = userAnswers[item.sa.id];
        if (saAns !== undefined) {
          completed++;
          if (saAns.isAchieved) saAchieved++;
        }
      });
      return { completed, mcCorrect, saAchieved };
    }

    function isQuizCompleted() {
      return getCompletedCounts().completed === quizData.length * 2;
    }

    // INITIALIZE APP
    window.addEventListener('DOMContentLoaded', () => {
      const saved = loadProgress();
      userAnswers = saved.userAnswers;
      window.__eteAllDone = saved.completed;

      renderWeekSelector();
      renderWeeks();
      renderSummaryTable();
      restoreAnswersFromStorage();
    });

    // RENDER SIDEBAR WEEK SELECTOR
    function renderWeekSelector() {
      const list = document.getElementById('week-selector-list');
      list.innerHTML = '';
      quizData.forEach(item => {
        const btn = document.createElement('button');
        btn.className = "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between hover:bg-slate-100 border border-transparent";
        btn.id = `nav-week-${item.week}`;
        btn.onclick = () => scrollToWeek(item.week);
        btn.innerHTML = `
          <span class="truncate">Sem. ${item.week}: ${item.title.split(':')[1] || item.title}</span>
          <span id="badge-week-${item.week}" class="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold">0/2</span>
        `;
        list.appendChild(btn);
      });
    }

    // RENDER WEEK CARDS AND EXERCISES
    function renderWeeks() {
      const container = document.getElementById('weeks-container');
      container.innerHTML = '';

      quizData.forEach(item => {
        const card = document.createElement('div');
        card.id = `week-card-${item.week}`;
        card.className = "bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-all";

        card.innerHTML = `
          <!-- WEEK HEADER -->
          <div class="bg-slate-800 text-white p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-700">
            <div>
              <span class="bg-utn-gold text-utn-blue text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">Syllabus UTN</span>
              <h3 class="text-lg font-bold mt-1 text-white">${item.title}</h3>
              <p class="text-xs text-slate-300 mt-0.5">${item.outcome}</p>
            </div>
            <div class="text-right flex-shrink-0">
              <span id="status-tag-w${item.week}" class="text-xs bg-slate-700 text-slate-300 px-3 py-1 rounded-full font-semibold">Pendiente</span>
            </div>
          </div>

          <div class="p-6 space-y-8">
            
            <!-- EXERCISE 1: MULTIPLE CHOICE -->
            <div class="space-y-4 border-b pb-6">
              <div class="flex items-center gap-2 text-utn-blue font-bold text-sm">
                <span class="bg-blue-100 text-utn-blue px-2 py-0.5 rounded border border-blue-200">Ejercicio 1</span>
                <span>Selección Única (Gramática y Funciones)</span>
              </div>

              <p class="text-sm font-medium text-slate-800 leading-relaxed">${item.mc.question}</p>

              <!-- OPTIONS -->
              <div class="grid grid-cols-1 gap-2.5" id="${item.mc.id}_options">
                ${item.mc.options.map((opt, idx) => `
                  <button onclick="checkMC('${item.week}', '${item.mc.id}', ${idx})" 
                          id="${item.mc.id}_opt_${idx}"
                          class="mc-option-btn w-full text-left p-3.5 rounded-lg border border-slate-200 hover:border-utn-blue hover:bg-blue-50/50 transition text-xs sm:text-sm text-slate-700 flex items-start gap-3">
                    <span class="bg-slate-100 font-bold text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">${String.fromCharCode(65 + idx)}</span>
                    <span class="flex-grow">${opt.text}</span>
                  </button>
                `).join('')}
              </div>

              <!-- HINT & FEEDBACK -->
              <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button onclick="toggleHint('${item.mc.id}_hint')" class="text-utn-accent hover:underline flex items-center gap-1 font-semibold">
                  <i class="fa-regular fa-lightbulb"></i> Ver Pista
                </button>
              </div>

              <div id="${item.mc.id}_hint" class="hidden text-xs bg-amber-50 text-amber-800 p-3 rounded-lg border border-amber-200">
                💡 <strong>Pista:</strong> ${item.mc.hint}
              </div>

              <div id="${item.mc.id}_feedback" class="hidden p-4 rounded-lg text-xs leading-relaxed"></div>
            </div>

            <!-- EXERCISE 2: SHORT ANSWER (COMMUNICATIVE INTENT) -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 text-utn-blue font-bold text-sm">
                <span class="bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">Ejercicio 2</span>
                <span>Respuesta Corta (Evaluación de Intención Comunicativa)</span>
              </div>

              <p class="text-sm font-medium text-slate-800 leading-relaxed">${item.sa.prompt}</p>

              <div class="space-y-2">
                <label class="block text-xs font-semibold text-slate-600">Escribe tu respuesta en inglés:</label>
                <textarea id="${item.sa.id}_input" rows="3" 
                          placeholder="Type your English response here..."
                          class="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-utn-blue focus:border-transparent text-xs sm:text-sm text-slate-800"></textarea>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <button onclick="evaluateShortAnswer('${item.week}', '${item.sa.id}')" class="bg-utn-blue hover:bg-blue-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow transition flex items-center gap-2">
                  <i class="fa-solid fa-paper-plane"></i>
                  <span>Evaluar Intención Comunicativa</span>
                </button>
                <span class="text-[11px] text-slate-400">Revisión enfocada en la transmisión clara del mensaje.</span>
              </div>

              <!-- SHORT ANSWER FEEDBACK BOX -->
              <div id="${item.sa.id}_feedback" class="hidden bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3 text-xs">
                <!-- Populated dynamically -->
              </div>
            </div>

          </div>
        `;

        container.appendChild(card);
      });
    }

    // CHECK MULTIPLE CHOICE
    function checkMC(weekNum, mcId, selectedIdx) {
      const item = quizData.find(w => w.week == weekNum);
      const selectedOpt = item.mc.options[selectedIdx];

      // Update state + persist
      if (!userAnswers[mcId]) userAnswers[mcId] = {};
      userAnswers[mcId].selected = selectedIdx;
      userAnswers[mcId].isCorrect = selectedOpt.isCorrect;
      saveProgress();

      applyMCResult(item, selectedIdx);
    }

    // APPLY MULTIPLE CHOICE RESULT TO UI (also used on restore)
    function applyMCResult(item, selectedIdx) {
      const mcId = item.mc.id;
      const selectedOpt = item.mc.options[selectedIdx];

      // Update UI buttons
      item.mc.options.forEach((opt, idx) => {
        const btn = document.getElementById(`${mcId}_opt_${idx}`);
        btn.disabled = true;
        btn.classList.remove('hover:border-utn-blue', 'hover:bg-blue-50/50');

        if (idx === selectedIdx) {
          if (opt.isCorrect) {
            btn.className = "w-full text-left p-3.5 rounded-lg border-2 border-green-500 bg-green-50 text-green-900 font-medium text-xs sm:text-sm flex items-start gap-3";
          } else {
            btn.className = "w-full text-left p-3.5 rounded-lg border-2 border-red-400 bg-red-50 text-red-900 text-xs sm:text-sm flex items-start gap-3";
          }
        } else if (opt.isCorrect) {
          btn.className = "w-full text-left p-3.5 rounded-lg border-2 border-green-500/60 bg-green-50/50 text-slate-800 text-xs sm:text-sm flex items-start gap-3";
        } else {
          btn.className = "w-full text-left p-3.5 rounded-lg border border-slate-200 text-slate-400 text-xs sm:text-sm flex items-start gap-3 opacity-60";
        }
      });

      // Show rationale feedback
      const fbBox = document.getElementById(`${mcId}_feedback`);
      fbBox.classList.remove('hidden');
      if (selectedOpt.isCorrect) {
        fbBox.className = "p-4 rounded-lg text-xs leading-relaxed bg-green-100 text-green-900 border border-green-300";
        fbBox.innerHTML = `<strong><i class="fa-solid fa-circle-check"></i> ¡Excelente! Respuesta Correcta:</strong> ${selectedOpt.rationale}`;
      } else {
        fbBox.className = "p-4 rounded-lg text-xs leading-relaxed bg-red-100 text-red-900 border border-red-300";
        fbBox.innerHTML = `<strong><i class="fa-solid fa-circle-xmark"></i> Opción Incorrecta:</strong> ${selectedOpt.rationale}`;
      }

      updateWeekStatus(item.week);
    }

    // EVALUATE SHORT ANSWER (FOCUS ON INTENT & MEANING)
    function evaluateShortAnswer(weekNum, saId) {
      const item = quizData.find(w => w.week == weekNum);
      const inputVal = document.getElementById(`${saId}_input`).value.trim();

      if (!inputVal) {
        showToast('Por favor escribe una respuesta antes de evaluar.', 'warning');
        return;
      }

      // Semantic / Keyword check logic
      const lowerInput = inputVal.toLowerCase();
      const matchedKeywords = item.sa.keywords.filter(kw => lowerInput.includes(kw));

      let intentScore = "Logrado";
      if (inputVal.length < 12 || matchedKeywords.length === 0) {
        intentScore = "Revisar Intención";
      }

      // Save state + persist
      if (!userAnswers[saId]) userAnswers[saId] = {};
      userAnswers[saId].text = inputVal;
      userAnswers[saId].status = intentScore;
      userAnswers[saId].isAchieved = (intentScore === "Logrado");
      saveProgress();

      renderSAFeedback(item, inputVal, intentScore);
    }

    // RENDER SHORT ANSWER FEEDBACK (also used on restore)
    function renderSAFeedback(item, inputVal, intentScore) {
      const saId = item.sa.id;
      const fbBox = document.getElementById(`${saId}_feedback`);
      const isAchieved = (intentScore === "Logrado");
      const badgeColor = isAchieved
        ? "bg-green-100 text-green-800 border-green-300"
        : "bg-amber-100 text-amber-800 border-amber-300";
      const icon = isAchieved
        ? "fa-circle-check text-green-600"
        : "fa-triangle-exclamation text-amber-600";

      fbBox.classList.remove('hidden');
      fbBox.innerHTML = `
        <div class="flex items-center justify-between border-b pb-2">
          <div class="flex items-center gap-2 font-bold text-slate-800">
            <i class="fa-solid ${icon}"></i>
            <span>Resultado de la Revisión de Intención</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}">${intentScore}</span>
        </div>

        <div class="space-y-2 text-slate-700">
          <p><strong>Criterios de Comunicación Evaluados:</strong></p>
          <ul class="list-disc list-inside space-y-1 text-[11px] text-slate-600">
            ${item.sa.keyCriteria.map(c => `<li>${c}</li>`).join('')}
          </ul>

          <div class="bg-blue-50/80 p-3 rounded border border-blue-200 mt-2">
            <span class="font-bold text-utn-blue block mb-1">Ejemplo de Respuesta Modelo (Referencia):</span>
            <p class="italic text-slate-800">${item.sa.sampleAnswer}</p>
          </div>

          <div class="pt-2">
            <span class="font-semibold text-slate-700 block mb-1">Autoevaluación de Intención Comunicativa:</span>
            <p class="text-[11px] text-slate-500 mb-2">Compara tu respuesta ("<em>${inputVal}</em>") con la respuesta modelo. ¿Se entiende claramente lo que querías transmitir?</p>
            <div class="flex gap-2">
              <button onclick="confirmSelfEval('${item.week}', '${saId}', true)" class="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold rounded text-[11px] transition">
                ✓ Transmite la idea claramente
              </button>
              <button onclick="confirmSelfEval('${item.week}', '${saId}', false)" class="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded text-[11px] transition">
                ✕ Debo precisar la idea
              </button>
            </div>
          </div>
        </div>
      `;

      updateWeekStatus(item.week);
    }

    // CONFIRM SELF EVALUATION FOR SHORT ANSWER
    function confirmSelfEval(weekNum, saId, isAchieved) {
      if (!userAnswers[saId]) userAnswers[saId] = {};
      userAnswers[saId].isAchieved = isAchieved;
      userAnswers[saId].status = isAchieved ? "Logrado" : "Revisar Intención";
      saveProgress();

      const fbBox = document.getElementById(`${saId}_feedback`);
      const badge = fbBox.querySelector('span.rounded-full');
      if (badge) {
        badge.textContent = userAnswers[saId].status;
        badge.className = isAchieved 
          ? "px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-green-100 text-green-800 border-green-300"
          : "px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-amber-100 text-amber-800 border-amber-300";
      }

      updateWeekStatus(weekNum);
    }

    // TOGGLE HINT DISPLAY
    function toggleHint(hintId) {
      const hint = document.getElementById(hintId);
      hint.classList.toggle('hidden');
    }

    // UPDATE WEEK AND OVERALL PROGRESS
    function updateWeekStatus(weekNum) {
      const item = quizData.find(w => w.week == weekNum);
      const mcDone = userAnswers[item.mc.id] !== undefined;
      const saDone = userAnswers[item.sa.id] !== undefined;

      let count = 0;
      if (mcDone) count++;
      if (saDone) count++;

      // Update badge in sidebar
      const badge = document.getElementById(`badge-week-${weekNum}`);
      if (badge) {
        badge.textContent = `${count}/2`;
        badge.className = count === 2 
          ? "text-[10px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full font-bold"
          : "text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full font-bold";
      }

      // Update status on card header
      const statusTag = document.getElementById(`status-tag-w${weekNum}`);
      if (statusTag) {
        if (count === 2) {
          statusTag.textContent = "Completado";
          statusTag.className = "text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold";
        } else if (count === 1) {
          statusTag.textContent = "1/2 Listo";
          statusTag.className = "text-xs bg-amber-500 text-white px-3 py-1 rounded-full font-bold";
        }
      }

      calculateOverallProgress();
    }

    // CALCULATE OVERALL PROGRESS
    function calculateOverallProgress() {
      const totalExercises = quizData.length * 2;
      const totalCompleted = getCompletedCounts().completed;

      document.getElementById('overall-progress').textContent = `${totalCompleted} / ${totalExercises} Completados`;
      updateCompletionUI();
      calculateFinalScore();
    }

    // COMPLETION STATE (badge + save + felicitación única)
    function updateCompletionUI() {
      const badge = document.getElementById('completed-badge');
      const done = isQuizCompleted();

      if (badge) {
        badge.classList.toggle('hidden', !done);
        badge.classList.toggle('inline-flex', done);
      }
      if (done && !window.__eteAllDone) {
        window.__eteAllDone = true;
        saveProgress();
        showToast(`¡Felicitaciones! Completaste los ${quizData.length * 2} ejercicios del curso.`, 'success');
      }
    }

    // SCROLL TO SPECIFIC WEEK
    function scrollToWeek(weekNum) {
      const el = document.getElementById(`week-card-${weekNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    function showAllWeeks() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function scrollToFinalReview() {
      const el = document.getElementById('final-review-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // RENDER SUMMARY TABLE IN FINAL REVIEW
    function renderSummaryTable() {
      const tbody = document.getElementById('summary-table-body');
      tbody.innerHTML = '';

      quizData.forEach(item => {
        const tr = document.createElement('tr');
        tr.id = `summary-row-w${item.week}`;
        tr.className = "hover:bg-slate-50 transition";

        tr.innerHTML = `
          <td class="p-3 font-bold text-utn-blue">Semana ${item.week}</td>
          <td class="p-3 font-medium text-slate-700">${item.title.split(':')[1] || item.title}</td>
          <td class="p-3 text-center" id="summary-mc-w${item.week}">
            <span class="text-slate-400 font-semibold">-</span>
          </td>
          <td class="p-3 text-center" id="summary-sa-w${item.week}">
            <span class="text-slate-400 font-semibold">-</span>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // CALCULATE FINAL SCORES
    function calculateFinalScore() {
      const counts = getCompletedCounts();
      const completedCount = counts.completed;
      const mcCorrectCount = counts.mcCorrect;
      const saAchievedCount = counts.saAchieved;

      quizData.forEach(item => {
        // MC Check
        const mcAns = userAnswers[item.mc.id];
        const mcCell = document.getElementById(`summary-mc-w${item.week}`);
        if (mcAns !== undefined) {
          if (mcAns.isCorrect) {
            if (mcCell) mcCell.innerHTML = `<span class="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded text-[11px]"><i class="fa-solid fa-check"></i> Correcto</span>`;
          } else {
            if (mcCell) mcCell.innerHTML = `<span class="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[11px]"><i class="fa-solid fa-xmark"></i> Incorrecto</span>`;
          }
        }

        // SA Check
        const saAns = userAnswers[item.sa.id];
        const saCell = document.getElementById(`summary-sa-w${item.week}`);
        if (saAns !== undefined) {
          if (saAns.isAchieved) {
            if (saCell) saCell.innerHTML = `<span class="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[11px]"><i class="fa-solid fa-thumbs-up"></i> Logrado</span>`;
          } else {
            if (saCell) saCell.innerHTML = `<span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[11px]"><i class="fa-solid fa-pen-to-square"></i> Por Mejorar</span>`;
          }
        }
      });

      // Update Top Stats (totales dinámicos)
      const total = quizData.length * 2;
      document.getElementById('stat-completed').textContent = `${completedCount} / ${total}`;
      document.getElementById('stat-mc-correct').textContent = `${mcCorrectCount} / ${quizData.length}`;
      document.getElementById('stat-sa-achieved').textContent = `${saAchievedCount} / ${quizData.length}`;
    }

    // RESTORE ANSWERS SAVED IN STORAGE (re-renders the UI state)
    function restoreAnswersFromStorage() {
      quizData.forEach(item => {
        const mcAns = userAnswers[item.mc.id];
        if (mcAns !== undefined && typeof mcAns.selected === 'number') {
          applyMCResult(item, mcAns.selected);
        }

        const saAns = userAnswers[item.sa.id];
        if (saAns !== undefined && typeof saAns.text === 'string' && saAns.text) {
          renderSAFeedback(item, saAns.text, saAns.status || 'Revisar Intención');
        }

        updateWeekStatus(item.week);
      });
      calculateOverallProgress();
    }

    // RESTART QUIZ (clears saved answers and resets the whole UI)
    function restartQuiz() {
      if (!window.confirm('¿Seguro que deseas reiniciar el quiz? Se borrarán todas tus respuestas guardadas y el progreso de este curso.')) return;

      userAnswers = {};
      window.__eteAllDone = false;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // Almacenamiento no disponible: no hay nada que limpiar.
      }

      renderWeekSelector();
      renderWeeks();
      renderSummaryTable();
      calculateOverallProgress();

      showToast('Quiz reiniciado. ¡Éxitos en tu nuevo intento!', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

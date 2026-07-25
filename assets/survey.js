/* ============================================================
   StrAI.ca — homepage assessment + contact form
   Loaded only on the homepage. Relies on applyLang() from app.js.
============================================================ */
(function () {
  function L() { return localStorage.getItem('strai-lang') || 'fr'; }

  // ---- Assessment ----
  const card = document.getElementById('survey-card');
  if (card) {
    const totalSteps = 5;
    let currentStep = 1;
    const answers = {};
    const progress = document.getElementById('survey-progress');

    function updateProgress() {
      progress.style.width = ((currentStep - 1) / totalSteps) * 100 + '%';
    }
    function goStep(n) {
      card.querySelector(`.survey-step[data-step="${currentStep}"]`).classList.remove('active');
      currentStep = n;
      card.querySelector(`.survey-step[data-step="${currentStep}"]`).classList.add('active');
      updateProgress();
    }
    function selectOption(opt) {
      const step = opt.closest('.survey-step');
      step.querySelectorAll('.survey-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[currentStep] = opt.dataset.value;

      let delay = 350;
      if (currentStep === 1) {
        const teach = document.getElementById('q1-teach');
        if (teach && opt.dataset.teachFr) {
          teach.setAttribute('data-fr', opt.dataset.teachFr);
          teach.setAttribute('data-en', opt.dataset.teachEn);
          teach.innerHTML = opt.getAttribute('data-teach-' + L());
          teach.classList.add('show');
          delay = 1600;
        }
      }
      setTimeout(() => {
        if (currentStep < totalSteps) goStep(currentStep + 1);
        else showResults();
      }, delay);
    }

    card.querySelectorAll('.survey-option').forEach(o =>
      o.addEventListener('click', () => selectOption(o)));
    card.querySelectorAll('.survey-back').forEach(b =>
      b.addEventListener('click', () => { if (currentStep > 1) goStep(currentStep - 1); }));

    function setBoth(id, fr, en) {
      const el = document.getElementById(id);
      el.setAttribute('data-fr', fr);
      el.setAttribute('data-en', en);
    }

    function showResults() {
      card.querySelectorAll('.survey-step').forEach(s => s.classList.remove('active'));
      progress.style.width = '100%';
      const d = buildDiagnosis(answers);

      setBoth('diag-title', d.title_fr, d.title_en);
      setBoth('diag-why', d.why_fr, d.why_en);
      setBoth('diag-tool', d.tool_fr, d.tool_en);
      setBoth('diag-package', d.pkg_fr, d.pkg_en);

      const wrap = document.getElementById('diag-example-wrap');
      const ex = document.getElementById('diag-example');
      if (d.example) {
        ex.setAttribute('href', d.example.href);
        ex.setAttribute('data-fr', d.example.fr);
        ex.setAttribute('data-en', d.example.en);
        wrap.style.display = '';
      } else {
        wrap.style.display = 'none';
      }

      const needs = document.getElementById('diag-needs');
      needs.innerHTML = '';
      d.needs.forEach(n => {
        const li = document.createElement('li');
        li.setAttribute('data-fr', n.fr);
        li.setAttribute('data-en', n.en);
        needs.appendChild(li);
      });

      document.getElementById('survey-results').classList.add('active');
      applyLang(L()); // fills every data-fr/data-en we just set
    }

    // ---- Diagnosis model ----
    const EX = {
      observer: { href: '/examples/ormstown-observer/',
        fr: "Principe semblable : L'Ormstown Observer — des documents dispersés deviennent des explications structurées, sources conservées. →",
        en: "Same principle: The Ormstown Observer — scattered documents become structured explanations, sources kept. →" },
      ormstowngpt: { href: '/examples/ormstowngpt/',
        fr: "Principe semblable : OrmstownGPT — des réponses tirées d'environ 130 documents officiels, avec un lien vers chaque source. →",
        en: "Same principle: OrmstownGPT — answers drawn from about 130 official documents, each linked to its source. →" },
      automation: { href: '/examples/automation/',
        fr: "Principe semblable : réception et suivi automatisés — une demande devient une tâche, un rappel et un brouillon à valider. →",
        en: "Same principle: automated intake & follow-up — a request becomes a task, a reminder, and a draft to review. →" }
    };

    const PKG = {
      ancrage: { fr: "<strong>Forfait Ancrage</strong> — organiser vos informations et créer des modèles réutilisables.",
                 en: "<strong>Ancrage package</strong> — organize your information and build reusable templates." },
      momentum: { fr: "<strong>Forfait Momentum</strong> — préparer subventions et rapports plus rapidement.",
                  en: "<strong>Momentum package</strong> — prepare grants and reports faster." },
      autonomie: { fr: "<strong>Forfait Autonomie</strong> — organiser plusieurs processus récurrents dans un même système.",
                   en: "<strong>Autonomie package</strong> — organize several recurring processes in one system." },
      discovery: { fr: "Un appel de 30 minutes pour choisir ensemble le bon point de départ, sans obligation.",
                   en: "A 30-minute call to choose the right starting point together, no obligation." }
    };

    const FAM = {
      writing: {
        title_fr: "Organiser l'information derrière vos documents récurrents.",
        title_en: "Organize the information behind your recurring documents.",
        why_fr: "Vous préparez régulièrement des documents à partir d'informations réparties dans plusieurs fichiers. Une base approuvée aiderait votre équipe à retrouver les bons faits et à produire des premiers jets plus cohérents.",
        why_en: "You regularly prepare documents from information spread across several files. An approved base would help your team find the right facts and produce more consistent first drafts.",
        tool_fr: "Une base de connaissances avec un assistant de rédaction : descriptions de programmes, résultats antérieurs, modèles et consignes approuvés — pour un premier jet à vérifier avant utilisation.",
        tool_en: "A knowledge base with a drafting assistant: approved program descriptions, past results, templates, and instructions — for a first draft to check before use.",
        example: 'observer', pkg: 'ancrage'
      },
      finding: {
        title_fr: "Regrouper l'information dispersée en un espace consultable.",
        title_en: "Bring scattered information into one searchable space.",
        why_fr: "L'information existe, mais on ne sait pas toujours dans quel fichier la chercher. La rassembler et la rendre interrogeable réduit les recherches répétées.",
        why_en: "The information exists, but it's not always clear which file to look in. Gathering it and making it searchable cuts down on repeated searches.",
        tool_fr: "Une base de connaissances consultable, ou un assistant de recherche qui répond à partir de vos documents et renvoie à la source.",
        tool_en: "A searchable knowledge base, or a research assistant that answers from your documents and links back to the source.",
        example: 'ormstowngpt', pkg: 'momentum'
      },
      followup: {
        title_fr: "Transformer les demandes reçues en suivis visibles.",
        title_en: "Turn incoming requests into visible follow-up.",
        why_fr: "Quand une demande arrive par courriel ou formulaire, plusieurs étapes manuelles peuvent être oubliées les jours occupés. Un flux les rend systématiques.",
        why_en: "When a request arrives by email or form, several manual steps can be missed on busy days. A workflow makes them systematic.",
        tool_fr: "Un flux qui capte la demande, vérifie les champs essentiels, crée la tâche, prévient la bonne personne, fixe les rappels et prépare un brouillon — avec validation avant tout envoi.",
        tool_en: "A workflow that captures the request, checks the essential fields, creates the task, notifies the right person, sets reminders, and prepares a draft — with a human check before anything is sent.",
        example: 'automation', pkg: 'autonomie'
      },
      multistep: {
        title_fr: "Faire circuler un même dossier d'une étape à l'autre.",
        title_en: "Carry one file through every step.",
        why_fr: "Quand chaque étape est préparée séparément, les détails se perdent et les mêmes données sont recopiées. Réutiliser l'information d'une étape à l'autre réduit les reprises.",
        why_en: "When each step is prepared separately, details get lost and the same data is recopied. Reusing information from step to step cuts down on rework.",
        tool_fr: "Des outils reliés qui reprennent l'information saisie au départ — de la demande à l'analyse, à la planification et au rapport final.",
        tool_en: "Connected tools that reuse the information entered up front — from request to analysis, scheduling, and the final report.",
        example: null, pkg: 'autonomie'
      },
      questions: {
        title_fr: "Créer un assistant limité à vos documents approuvés.",
        title_en: "Create an assistant limited to your approved documents.",
        why_fr: "Votre équipe, vos membres ou le public posent souvent les mêmes questions. Un assistant limité à vos sources approuvées répond plus vite, tout en renvoyant à la source.",
        why_en: "Your team, your members, or the public often ask the same questions. An assistant limited to your approved sources answers faster, while still pointing to the source.",
        tool_fr: "Un assistant de questions-réponses restreint à vos politiques, programmes et procédures, avec un lien vers le document d'origine à chaque réponse.",
        tool_en: "A question-and-answer assistant restricted to your policies, programs, and procedures, with a link to the source document on every answer.",
        example: 'ormstowngpt', pkg: 'momentum'
      },
      unsure: {
        title_fr: "Repérer ensemble votre premier irritant.",
        title_en: "Find your first bottleneck together.",
        why_fr: "Pas de souci si le point de départ n'est pas encore clair. Un court appel permet d'examiner les tâches qui absorbent le plus de temps et de choisir un début réaliste.",
        why_en: "No problem if the starting point isn't clear yet. A short call lets us look at the tasks that absorb the most time and choose a realistic start.",
        tool_fr: "Un appel de diagnostic de 30 minutes : nous regardons vos tâches récurrentes et proposons un premier chantier concret.",
        tool_en: "A 30-minute diagnostic call: we look at your recurring tasks and propose a concrete first project.",
        example: null, pkg: 'discovery'
      }
    };

    const READINESS_PKG = {
      organize: 'ancrage', drafts: 'momentum', automate: 'autonomie',
      assistant: 'momentum', connect: 'autonomie', choose: null
    };

    function buildDiagnosis(a) {
      const fam = FAM[a[1]] || FAM.unsure;
      let why_fr = fam.why_fr, why_en = fam.why_en;

      // Enrich from where the information lives (Q2)
      if (['heads', 'apps', 'sheets'].includes(a[2])) {
        why_fr += " Avant d'automatiser, une première étape sera d'organiser cette information et de décider ce qui peut être utilisé.";
        why_en += " Before automating, a first step will be to organize that information and decide what can be used.";
      }
      // Enrich from frequency (Q4)
      if (a[4] === 'daily' || a[4] === 'weekly') {
        why_fr += " Comme ce travail revient souvent, une amélioration répétée aura un fort effet cumulatif.";
        why_en += " Because this recurs often, a repeated improvement adds up quickly.";
      }

      // Package: readiness first (Q5), else family default
      let pkgKey = fam.pkg;
      if (a[1] === 'unsure') pkgKey = 'discovery';
      else if (a[5] && READINESS_PKG[a[5]] !== undefined) pkgKey = READINESS_PKG[a[5]] || 'discovery';
      const pkg = PKG[pkgKey];

      const needs = (a[1] === 'unsure') ? [
        { fr: "Un aperçu des tâches qui prennent le plus de temps à votre équipe.", en: "A sense of the tasks that take your team the most time." },
        { fr: "Les outils que vous utilisez déjà.", en: "The tools you already use." }
      ] : [
        { fr: "Deux ou trois documents représentatifs.", en: "Two or three representative documents." },
        { fr: "La personne responsable de l'approbation finale.", en: "The person responsible for final approval." },
        { fr: "Un accès à votre espace de stockage actuel (Drive, 365, Notion…).", en: "Access to your current storage (Drive, 365, Notion…)." }
      ];

      return {
        title_fr: fam.title_fr, title_en: fam.title_en,
        why_fr, why_en,
        tool_fr: fam.tool_fr, tool_en: fam.tool_en,
        example: fam.example ? EX[fam.example] : null,
        needs,
        pkg_fr: pkg.fr, pkg_en: pkg.en
      };
    }

    updateProgress();
  }

  // ---- Contact form (Formspree) ----
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const done = () => {
        contactForm.style.display = 'none';
        const h = document.querySelector('#contact-form-wrap h3');
        if (h) h.style.display = 'none';
        document.getElementById('form-success').classList.add('active');
      };
      fetch(contactForm.action, {
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      }).then(r => { if (r.ok) done(); }).catch(done);
    });
  }
})();

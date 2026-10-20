(() => {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.menu-toggle');
    const panel = header?.querySelector('.mobile-panel');
    if (!toggle || !panel) return;
    const setOpen = open => {
        panel.classList.toggle('open', open);
        toggle.classList.toggle('active', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(!panel.classList.contains('open')));
    panel.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', event => {
        if (!panel.classList.contains('open')) return;
        if (event.key === 'Escape') { setOpen(false); toggle.focus(); }
        if (event.key === 'Tab') {
            const items = [header.querySelector('.brand'), toggle, ...panel.querySelectorAll('a')].filter(el => el && el.getClientRects().length);
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    window.matchMedia('(max-width: 900px)').addEventListener('change', event => { if (!event.matches) setOpen(false); });
})();

document.addEventListener('DOMContentLoaded', () => {

    const heroSection = document.querySelector('.hero');
    const backgroundImages = [
        'slider01.jpg',
        'slider02.jpg',
        'slider03.jpg',
        'slider04.jpg',
        'slider05.jpg',
        'slider06.jpg',
        'slider07.jpg',
        'slider08.jpg',
        'slider09.jpg'
    ];

    if (heroSection) {
        const randomIndex = Math.floor(Math.random() * backgroundImages.length);
        heroSection.style.backgroundImage = `url('images/${backgroundImages[randomIndex]}')`;
    }

    const videoWrapper = document.getElementById('resourcesVideoWrapper') || document.getElementById('videoWrapper');
    const videoOverlay = document.getElementById('resourcesVideoOverlay') || document.getElementById('videoOverlay');
    const promoVideo = document.getElementById('resourcesPromoVideo') || document.getElementById('promoVideo');

    if (videoWrapper && videoOverlay && promoVideo) {
        videoWrapper.addEventListener('click', () => {
            videoOverlay.style.display = 'none';
            promoVideo.style.display = 'block';
            promoVideo.play().catch(() => {});
        });
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 400);
    });

});

let mybutton = document.getElementById("yukariCikButonu");
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
  if (!mybutton) return;
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}
function basaDon() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}

const videos = Array.from(document.querySelectorAll('.hover-video'));
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

function prepareVideo(video) {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('preload', 'metadata');
}

function safePlay(video) {
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
    }
}

videos.forEach((video) => {
    prepareVideo(video);

    if (supportsHover) {
        video.addEventListener('mouseenter', () => safePlay(video));
        video.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    }
});

if (!supportsHover && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                videos.forEach((otherVideo) => {
                    if (otherVideo !== video) otherVideo.pause();
                });
                safePlay(video);
            } else {
                video.pause();
            }
        });
    }, {
        threshold: [0, 0.35, 0.75],
        rootMargin: '80px 0px'
    });

    videos.forEach((video) => observer.observe(video));
}

(function () {
    function setPlanType(type) {
        document.querySelectorAll('[data-plan-type]').forEach((button) => {
            const active = button.dataset.planType === type;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        document.querySelectorAll('[data-plan-group], [data-compare-group]').forEach((group) => {
            const groupType = group.dataset.planGroup || group.dataset.compareGroup;
            const active = groupType === type;
            group.hidden = !active;
            group.classList.toggle('active', active);
        });
        const heroTitle = document.getElementById('plans-hero-title');
        const heroSubtitle = document.getElementById('plans-hero-subtitle');
        const ctaTitle = document.getElementById('plans-cta-title');
        const ctaSubtitle = document.getElementById('plans-cta-subtitle');
        const ctaLink = document.getElementById('plans-cta-link');
        const ctaButton = document.getElementById('plans-cta-button');
        const campus = type === 'campus';
        if (heroTitle) heroTitle.textContent = campus ? 'Data-Driven Teaching for Institutional Excellence' : 'Find The Perfect Plan';
        if (heroSubtitle) heroSubtitle.textContent = campus ? 'Give every educator a CoursedUp plan. Give deans and program chairs the analytics to lead with evidence.' : "Start free. Upgrade when you're ready to share more of your teaching.";
        if (ctaTitle) ctaTitle.innerHTML = campus ? 'Bring CoursedUp<br>to your campus' : 'Let your course<br>live forever';
        if (ctaSubtitle) ctaSubtitle.textContent = campus ? "We'll walk you through scope, seats and setup." : 'Start free today. Upgrade anytime.';
        if (ctaLink) ctaLink.href = campus ? 'schedule' : 'https://app.coursedup.com/';
        if (ctaButton) ctaButton.textContent = campus ? 'SCHEDULE AN INFO SESSION' : 'START FREE';
    }

    function setBilling(period) {
        const data = {
            monthly: {
                premium: '$8.99', premiumNote: 'Billed monthly',
                plus: '$9.99', plusNote: 'Billed monthly'
            },
            yearly: {
                premium: '$2.99', premiumNote: '$35.88 billed yearly · save 67%',
                plus: '$4.99', plusNote: '$59.88 billed yearly · save 50%'
            }
        }[period];
        if (!data) return;
        document.querySelectorAll('[data-billing-option]').forEach((button) => {
            const active = button.dataset.billingOption === period;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        document.querySelectorAll('[data-premium-price], [data-premium-compare-price]').forEach((el) => el.textContent = data.premium);
        document.querySelectorAll('[data-premium-note], [data-premium-compare-note]').forEach((el) => el.textContent = data.premiumNote);
        document.querySelectorAll('[data-premium-plus-price], [data-premium-plus-compare-price]').forEach((el) => el.textContent = data.plus);
        document.querySelectorAll('[data-premium-plus-note], [data-premium-plus-compare-note]').forEach((el) => el.textContent = data.plusNote);
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-plan-type]').forEach((button) => {
            button.addEventListener('click', () => setPlanType(button.dataset.planType));
        });
        document.querySelectorAll('[data-billing-option]').forEach((button) => {
            button.addEventListener('click', () => setBilling(button.dataset.billingOption));
        });
        if (document.querySelector('[data-plan-type]')) {
            const applyPlanHash = () => setPlanType(location.hash === '#campus' ? 'campus' : 'individual');
            applyPlanHash();
            window.addEventListener('hashchange', applyPlanHash);
        }
        if (document.querySelector('[data-billing-option]')) setBilling('yearly');
    });
}());

document.addEventListener('DOMContentLoaded', function () {
    const upButton = document.getElementById('yukariCikButonu');
    if (upButton && !upButton.hasAttribute('onclick')) upButton.addEventListener('click', basaDon);

    const resourceTypeButtons = document.querySelectorAll('[data-resource-plan-type]');
    const resourceGroups = document.querySelectorAll('[data-resource-plan-group]');

    function closeResourceAccordions() {
        document.querySelectorAll('.resource-accordion-item').forEach(function (item) {
            item.classList.remove('is-open');
            const trigger = item.querySelector('.resource-accordion-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    }

    function setResourcePlanType(type) {
        resourceTypeButtons.forEach(function (button) {
            const active = button.dataset.resourcePlanType === type;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        resourceGroups.forEach(function (group) {
            const active = group.dataset.resourcePlanGroup === type;
            group.hidden = !active;
            group.classList.toggle('active', active);
        });

        closeResourceAccordions();
        document.querySelectorAll('.hover-video').forEach(function (video) {
            video.pause();
        });
    }

    resourceTypeButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            setResourcePlanType(button.dataset.resourcePlanType);
        });
    });

    if (resourceTypeButtons.length) setResourcePlanType('individual');

    document.querySelectorAll('.resources-accordion').forEach(function (accordion) {
        const items = accordion.querySelectorAll('.resource-accordion-item');

        items.forEach(function (item) {
            const trigger = item.querySelector('.resource-accordion-trigger');
            if (!trigger) return;

            trigger.addEventListener('click', function () {
                const opening = !item.classList.contains('is-open');

                items.forEach(function (other) {
                    other.classList.remove('is-open');
                    const otherTrigger = other.querySelector('.resource-accordion-trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                });

                if (opening) {
                    item.classList.add('is-open');
                    trigger.setAttribute('aria-expanded', 'true');
                }
            });
        });
    });
});

(function () {
    function setIndicatorState(video, button, label) {
        const paused = video.paused;
        button.classList.toggle('is-paused', paused);
        label.textContent = paused ? 'PLAY' : 'VIDEO';
        button.setAttribute('aria-label', paused ? 'Play video' : 'Pause video');
    }

    function toggleResourceVideo(video) {
        if (video.paused) {
            safePlay(video);
        } else {
            video.pause();
        }
    }

    document.querySelectorAll('.hover-video').forEach((video) => {
        if (video.closest('.resource-video-frame')) return;

        const frame = document.createElement('span');
        frame.className = 'resource-video-frame';
        video.parentNode.insertBefore(frame, video);
        frame.appendChild(video);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'resource-video-indicator';
        button.innerHTML = '<span class="resource-video-indicator-icon" aria-hidden="true"></span><span class="resource-video-indicator-label">VIDEO</span>';
        frame.appendChild(button);

        const label = button.querySelector('.resource-video-indicator-label');
        setIndicatorState(video, button, label);

        video.addEventListener('play', () => setIndicatorState(video, button, label));
        video.addEventListener('pause', () => setIndicatorState(video, button, label));
        button.addEventListener('click', () => toggleResourceVideo(video));
        video.addEventListener('click', () => toggleResourceVideo(video));
    });
}());

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-carousel]').forEach((section) => {
        const track = section.querySelector('.veu-track');
        const buttons = section.querySelectorAll('.veu-arrow');
        if (!track || !buttons.length) return;

        const getStep = () => {
            const card = track.querySelector(':scope > *');
            if (!card) return track.clientWidth * 0.8;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            return card.getBoundingClientRect().width + gap;
        };

        const indicator = document.createElement('div');
        indicator.className = 'veu-scroll-indicator';
        indicator.setAttribute('aria-hidden', 'true');
        const indicatorThumb = document.createElement('span');
        indicatorThumb.className = 'veu-scroll-indicator-thumb';
        indicator.appendChild(indicatorThumb);
        track.insertAdjacentElement('afterend', indicator);

        let indicatorTimer;

        const updateIndicator = () => {
            const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
            if (maxScroll <= 1) {
                indicator.style.display = 'none';
                return;
            }

            indicator.style.display = '';
            const visibleRatio = Math.min(1, track.clientWidth / track.scrollWidth);
            const thumbWidth = Math.max(48, indicator.clientWidth * visibleRatio);
            const travel = Math.max(0, indicator.clientWidth - thumbWidth);
            const progress = maxScroll ? track.scrollLeft / maxScroll : 0;
            indicatorThumb.style.width = `${thumbWidth}px`;
            indicatorThumb.style.transform = `translateX(${travel * progress}px)`;
        };

        const showIndicatorTemporarily = () => {
            updateIndicator();
            indicator.classList.add('is-visible');
            window.clearTimeout(indicatorTimer);
            indicatorTimer = window.setTimeout(() => {
                indicator.classList.remove('is-visible');
            }, 700);
        };

        const updateButtons = () => {
            const maxScroll = track.scrollWidth - track.clientWidth;
            buttons.forEach((button) => {
                const direction = Number(button.dataset.direction);
                button.disabled = direction < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= maxScroll - 2;
            });
            updateIndicator();
        };

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                track.scrollBy({ left: getStep() * Number(button.dataset.direction), behavior: 'smooth' });
            });
        });

        track.addEventListener('scroll', () => {
            updateButtons();
            showIndicatorTemporarily();
        }, { passive: true });
        window.addEventListener('resize', updateButtons);
        updateButtons();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('[data-veu-hero-slider]');
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll('.veu-hero-slide'));
    const arrows = Array.from(hero.querySelectorAll('[data-veu-hero-direction]'));
    if (slides.length < 2) return;

    let activeIndex = 0;
    let autoplayTimer;
    let touchStartX = 0;
    let touchStartY = 0;

    const showSlide = (index) => {
        slides[activeIndex].classList.remove('is-active');
        activeIndex = (index + slides.length) % slides.length;
        slides[activeIndex].classList.add('is-active');
    };

    const startAutoplay = () => {
        window.clearInterval(autoplayTimer);
        autoplayTimer = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    };

    arrows.forEach((arrow) => {
        arrow.addEventListener('click', () => {
            showSlide(activeIndex + Number(arrow.dataset.veuHeroDirection));
            startAutoplay();
        });
    });

    hero.addEventListener('touchstart', (event) => {
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });

    hero.addEventListener('touchend', (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) < 45 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        showSlide(activeIndex + (deltaX < 0 ? 1 : -1));
        startAutoplay();
    }, { passive: true });

    startAutoplay();
});

document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('[data-free-activity-trigger]');
    const panel = document.querySelector('[data-free-activity-panel]');
    const form = document.querySelector('[data-free-activity-form]');
    const status = document.querySelector('[data-free-activity-status]');

    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.classList.toggle('is-open', !isOpen);

        if (!isOpen) {
            window.setTimeout(() => {
                panel.querySelector('select, input')?.focus({ preventScroll: true });
            }, 380);
        }
    });

});

document.addEventListener('DOMContentLoaded', async () => {
    const activityTypeSelect = document.querySelector('#freeActivityType');
    const disciplineSelect = document.querySelector('#freeActivityDiscipline');

    if (!activityTypeSelect || !disciplineSelect) return;

    try {
        const response = await fetch(
            'https://ali-karan.coursedup.com/api/sample-activity/options?language=en'
        );

        if (!response.ok) {
            throw new Error('Dropdown options could not be loaded.');
        }

        const data = await response.json();

        activityTypeSelect.innerHTML =
            '<option value="" selected disabled>Select activity type</option>';

        disciplineSelect.innerHTML =
            '<option value="" selected disabled>Select discipline</option>';

        data.activityTypes.forEach((activityType) => {
            const option = document.createElement('option');
            option.value = activityType;
            option.textContent = activityType;
            activityTypeSelect.appendChild(option);
        });

        data.disciplines.forEach((discipline) => {
            const option = document.createElement('option');
            option.value = discipline;
            option.textContent = discipline;
            disciplineSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error);

        activityTypeSelect.innerHTML =
            '<option value="">Options could not be loaded</option>';

        disciplineSelect.innerHTML =
            '<option value="">Options could not be loaded</option>';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('[data-free-activity-form]');
    const status = document.querySelector('[data-free-activity-status]');

    if (!form || !status) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const submitButton = form.querySelector('.free-activity-submit');

        const payload = {
            firstName: document.querySelector('#freeActivityFirstName').value.trim(),
            lastName: document.querySelector('#freeActivityLastName').value.trim(),
            email: document.querySelector('#freeActivityEmail').value.trim(),
            institution: document.querySelector('#freeActivityUniversity').value.trim(),
            discipline: document.querySelector('#freeActivityDiscipline').value,
            activityType: document.querySelector('#freeActivityType').value,
            language: 'en'
        };

        submitButton.disabled = true;
        status.textContent = 'Submitting...';

        try {
            const response = await fetch(
                'https://ali-karan.coursedup.com/api/sample-activity/request',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            status.textContent = result.message || 'Request completed.';
        } catch (error) {
            console.error(error);
            status.textContent = 'An error occurred. Please try again.';
        } finally {
            submitButton.disabled = false;
        }
    });
});

(() => {
    if (!document.body.classList.contains('home-landing')) return;
    const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}})},{threshold:.05,rootMargin:'0px 0px -20% 0px'});
    document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

    const modal=document.getElementById('videoModal');
    const video=document.getElementById('promoVideo');
    const openVideo=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');video.play().catch(()=>{})};
    const closeVideo=()=>{video.pause();modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
    document.getElementById('openVideo')?.addEventListener('click',openVideo);
    document.getElementById('videoPoster')?.addEventListener('click',openVideo);
    document.getElementById('videoClose')?.addEventListener('click',closeVideo);
    modal?.addEventListener('click',e=>{if(e.target===modal)closeVideo()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeVideo()});

    const prefersReducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clampValue=(v,min,max)=>Math.min(max,Math.max(min,v));
    const lerpValue=(a,b,t)=>a+(b-a)*t;
    const easeInOutCubic=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const smoothStep=t=>t*t*(3-2*t);
    const hexToRgb=hex=>{const value=hex.replace('#','');const full=value.length===3?value.split('').map(c=>c+c).join(''):value;const num=parseInt(full,16);return{r:(num>>16)&255,g:(num>>8)&255,b:num&255}};
    const mixColor=(from,to,t)=>`rgb(${Math.round(lerpValue(from.r,to.r,t))}, ${Math.round(lerpValue(from.g,to.g,t))}, ${Math.round(lerpValue(from.b,to.b,t))})`;
    const rangeProgress=(el,vh,startRatio=.78,endRatio=.50)=>{
        if(!el)return 0;
        const rect=el.getBoundingClientRect();
        const start=vh*startRatio;
        const end=vh*endRatio;
        return clampValue((start-rect.top)/(start-end),0,1);
    };

    const slowParallaxProgress=(el,vh,mobile=false)=>{
        if(!el)return 0;
        const rect=el.getBoundingClientRect();
        const visibleDelay=rect.height*(mobile?.20:.25);
        const startTop=vh-visibleDelay;
        const endCenterY=vh*(mobile?.42:.35);
        const endTop=endCenterY-(rect.height*.5);
        return clampValue((startTop-rect.top)/(startTop-endTop),0,1);
    };

    const activityPanel=document.querySelector('.image-panel');
    const activityStack=activityPanel?.querySelector('.card-stack');
    const activityCards=activityStack?[...activityStack.querySelectorAll('.activity-card')]:[];

    const analyticsStage=document.querySelector('.analytics-stage');
    const analyticsUi=analyticsStage?.querySelector('.analytics-ui');
    const scoreRing=analyticsUi?.querySelector('.score-ring');
    const scoreRingValue=scoreRing?.querySelector('span');
    const analyticsBars=analyticsUi?[...analyticsUi.querySelectorAll('.bars i')]:[];

    const campusBarsWrap=document.querySelector('.campus-bars');
    const campusBars=campusBarsWrap?[...campusBarsWrap.querySelectorAll('span')]:[];
    const campusDonut=document.querySelector('.campus-donut');

    const parallaxMedia=[
        ...[document.querySelector('.course-media-frame')].filter(Boolean).map(trigger=>({trigger,el:trigger.querySelector('img'),range:32})).filter(item=>item.el),
        ...[...document.querySelectorAll('.veu-strip article')].map(trigger=>({trigger,el:trigger.querySelector('img'),range:26})).filter(item=>item.el),
        ...[document.querySelector('.video-media-frame')].filter(Boolean).map(trigger=>({trigger,el:trigger.querySelector('img'),range:38})).filter(item=>item.el)
    ];

    const finalCta=document.querySelector('.final-cta');
    const finalTitle=finalCta?.querySelector('h2');
    const finalWords=[
        {el:document.querySelector('.final-show'),color:'#b93d50'},
        {el:document.querySelector('.final-build'),color:'#805489'},
        {el:document.querySelector('.final-know'),color:'#c19a00'}
    ].filter(item=>item.el);

    if(scoreRing&&scoreRingValue){
        const scoreTarget=parseInt(scoreRingValue.textContent.trim(),10)||0;
        scoreRing.dataset.target=String(scoreTarget);
        if(!prefersReducedMotion){scoreRingValue.textContent='0';scoreRing.style.setProperty('--ring-progress','0%')}
    }
    analyticsBars.forEach(bar=>{
        const target=bar.style.getPropertyValue('--w').trim()||'0%';
        bar.dataset.target=target;
        if(!prefersReducedMotion)bar.style.setProperty('--w','0%');
    });
    campusBars.forEach((bar,index)=>{
        if(!prefersReducedMotion){
            bar.style.setProperty('--campus-bar-scale','0');
            bar.style.setProperty('--campus-bar-opacity','.18');
            bar.style.transitionDelay=`${index*70}ms`;
        }
    });

    if(prefersReducedMotion){
        analyticsBars.forEach(bar=>bar.style.setProperty('--w',bar.dataset.target||'0%'));
        if(scoreRing&&scoreRingValue){scoreRing.style.setProperty('--ring-progress',`${scoreRing.dataset.target||0}%`);scoreRingValue.textContent=scoreRing.dataset.target||'0'}
        finalWords.forEach(item=>{item.el.style.color=item.color});
        parallaxMedia.forEach(item=>item.el.style.setProperty('--media-parallax-y','0px'));
        campusBars.forEach(bar=>{bar.style.setProperty('--campus-bar-scale','1');bar.style.setProperty('--campus-bar-opacity','1')});
        if(campusDonut)campusDonut.style.setProperty('--donut-angle','360deg');
    }else{
        let ticking=false;
        const inkColor=hexToRgb('#171924');
        finalWords.forEach(item=>{item.rgb=hexToRgb(item.color);item.el.style.color='#171924'});
        if(campusDonut)campusDonut.style.setProperty('--donut-angle','0deg');

        const updateScrollScenes=()=>{
            ticking=false;
            const vh=window.innerHeight||document.documentElement.clientHeight;
            const mobile=window.matchMedia('(max-width:600px)').matches;

            const cardsStartRatio=mobile?.92:.90;
            const cardsEndRatio=mobile?.44:.46;
            const analyticsStartRatio=mobile?.68:.72;
            const analyticsEndRatio=mobile?.20:.24;
            const finalStartRatio=mobile?.66:.70;
            const finalEndRatio=mobile?.24:.28;

            if(activityStack&&activityCards.length===3){
                const cardProgress=rangeProgress(activityStack,vh,cardsStartRatio,cardsEndRatio);
                const eased=smoothStep(cardProgress);
                const scale=mobile?.62:1;
                const starts=[{x:-150*scale,y:145*scale,r:-10},{x:145*scale,y:-72*scale,r:9},{x:8*scale,y:175*scale,r:4}];
                activityCards.forEach((card,i)=>{
                    const s=starts[i];
                    card.style.setProperty('--card-scroll-x',`${lerpValue(s.x,0,eased).toFixed(2)}px`);
                    card.style.setProperty('--card-scroll-y',`${lerpValue(s.y,0,eased).toFixed(2)}px`);
                    card.style.setProperty('--card-scroll-r',`${lerpValue(s.r,0,eased).toFixed(2)}deg`);
                });
            }

            if(analyticsStage&&scoreRing&&scoreRingValue){
                const eased=easeInOutCubic(rangeProgress(analyticsStage,vh,analyticsStartRatio,analyticsEndRatio));
                const score=parseInt(scoreRing.dataset.target||'0',10);
                scoreRing.style.setProperty('--ring-progress',`${(score*eased).toFixed(2)}%`);
                scoreRingValue.textContent=String(Math.round(score*eased));
                analyticsBars.forEach(bar=>{
                    const target=parseFloat((bar.dataset.target||'0').replace('%',''))||0;
                    bar.style.setProperty('--w',`${(target*eased).toFixed(2)}%`);
                });
            }

            if(campusBarsWrap&&campusBars.length){
                const campusProgress=smoothStep(rangeProgress(campusBarsWrap,vh,mobile?.90:.86,mobile?.56:.48));
                campusBars.forEach((bar,index)=>{
                    const stagger=clampValue((campusProgress-(index*.055))/(1-(index*.055)),0,1);
                    const easedBar=easeInOutCubic(stagger);
                    bar.style.setProperty('--campus-bar-scale',easedBar.toFixed(3));
                    bar.style.setProperty('--campus-bar-opacity',lerpValue(.18,1,easedBar).toFixed(3));
                });
            }

            if(campusDonut){
                const donutProgress=easeInOutCubic(rangeProgress(campusDonut,vh,mobile?.92:.88,mobile?.54:.48));
                campusDonut.style.setProperty('--donut-angle',`${(360*donutProgress).toFixed(2)}deg`);
            }

            parallaxMedia.forEach(item=>{
                const progress=slowParallaxProgress(item.trigger,vh,mobile);
                const eased=smoothStep(progress);
                const effectiveRange=(mobile&&item.trigger.matches('.video-media-frame'))?10:item.range;
                const offset=lerpValue(effectiveRange,-effectiveRange,eased);
                item.el.style.setProperty('--media-parallax-y',`${offset.toFixed(2)}px`);
            });


            if(finalTitle&&finalWords.length){
                const titleTop=finalTitle.getBoundingClientRect().top;
                const maxScroll=Math.max(0,document.documentElement.scrollHeight-vh);
                const reachableTop=titleTop+window.scrollY-maxScroll;
                const startTop=vh*finalStartRatio;
                const endTop=Math.max(vh*finalEndRatio,reachableTop+24);
                const sectionProgress=clampValue((startTop-titleTop)/Math.max(1,startTop-endTop),0,1);
                finalWords.forEach((item,index)=>{
                    const localStart=.12+(index*.25);
                    const localEnd=localStart+.20;
                    const localProgress=clampValue((sectionProgress-localStart)/(localEnd-localStart),0,1);
                    const easedLocal=easeInOutCubic(localProgress);
                    item.el.style.color=mixColor(inkColor,item.rgb,easedLocal);
                });
            }
        };

        const requestUpdate=()=>{if(ticking)return;ticking=true;requestAnimationFrame(updateScrollScenes)};
        window.addEventListener('scroll',requestUpdate,{passive:true});
        window.addEventListener('resize',requestUpdate);
        updateScrollScenes();
    }


    (()=>{
        const stage=document.querySelector('.how-output-stage');
        if(!stage)return;

        const screens=[
            stage.querySelector('.how-output-screen-a'),
            stage.querySelector('.how-output-screen-b'),
            stage.querySelector('.how-output-screen-c')
        ];
        if(screens.some(screen=>!screen))return;

        const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
        const smooth=t=>t*t*(3-2*t);
        const lerp=(a,b,t)=>a+(b-a)*t;

        if(reduceMotion){
            screens.forEach(screen=>{
                screen.style.setProperty('--output-x','0px');
                screen.style.setProperty('--output-y','0px');
                screen.style.setProperty('--output-r','0deg');
                screen.style.setProperty('--output-opacity','1');
                screen.style.setProperty('--output-s','1');
            });
            return;
        }

        let ticking=false;

        const update=()=>{
            ticking=false;
            const vh=window.innerHeight||document.documentElement.clientHeight;
            const rect=stage.getBoundingClientRect();
            const mobile=window.matchMedia('(max-width:700px)').matches;
            const start=vh*(mobile?.96:.94);
            const end=vh*(mobile?.50:.16);
            const raw=clamp((start-rect.top)/(start-end),0,1);
            const p=smooth(raw);

            const starts=mobile
                ? [
                    {scale:.78,delay:0},
                    {scale:.82,delay:.08},
                    {scale:.76,delay:.16}
                ]
                : [
                    {scale:.72,delay:0},
                    {scale:.78,delay:.08},
                    {scale:.74,delay:.16}
                ];

            screens.forEach((screen,index)=>{
                const s=starts[index];
                const localRaw=clamp((raw-s.delay)/(1-s.delay),0,1);
                const local=smooth(localRaw);
                screen.style.setProperty('--output-x','0px');
                screen.style.setProperty('--output-y','0px');
                screen.style.setProperty('--output-r','0deg');
                screen.style.setProperty('--output-s',lerp(s.scale,1,local).toFixed(4));
                screen.style.setProperty('--output-opacity',lerp(.30,1,local).toFixed(3));
            });
        };

        const request=()=>{
            if(ticking)return;
            ticking=true;
            requestAnimationFrame(update);
        };

        window.addEventListener('scroll',request,{passive:true});
        window.addEventListener('resize',request);
        update();
    })();
})();

(() => {
    if (!document.body.classList.contains('home-landing')) return;
    const sequence=document.querySelector('[data-hero-sequence]');
    if(!sequence)return;
    const sticky=sequence.querySelector('.hero-sequence-sticky');
    const product=sequence.querySelector('.hero-product');
    const leftLayer=sequence.querySelector('.hero-slide-layer-left');
    const rightLayer=sequence.querySelector('.hero-slide-layer-right');
    if(!sticky||!product||!leftLayer||!rightLayer)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const easeOut=t=>1-Math.pow(1-t,3);
    const lerp=(start,end,progress)=>start+(end-start)*progress;
    let mobileProgress=0;
    let mobileRevealed=false;

    const applyLayer=(side,progress,direction)=>{
        const mobile=window.matchMedia('(max-width:600px)').matches;
        const eased=easeOut(clamp(progress,0,1));
        const distance=(mobile?48:window.innerWidth*.66)*direction;
        sequence.style.setProperty(`--hero-${side}-x`,`${(distance*(1-eased)).toFixed(2)}px`);
        sequence.style.setProperty(`--hero-${side}-y`,`${(20*(1-eased)).toFixed(2)}px`);
        sequence.style.setProperty(`--hero-${side}-r`,`${((direction*4)*(1-eased)).toFixed(2)}deg`);
        sequence.style.setProperty(`--hero-${side}-scale`,(.90+(.10*eased)).toFixed(4));
        sequence.style.setProperty(`--hero-${side}-opacity`,eased.toFixed(4));
    };

    const renderMobileLayers=()=>{
        applyLayer('left',mobileProgress,-1);
        applyLayer('right',clamp((mobileProgress-.02)/.98,0,1),1);
    };

    const consumeMobileDelta=delta=>{
        if(!delta)return;
        mobileProgress=clamp(mobileProgress+(delta/360),0,1);
        renderMobileLayers();
    };

    const setProgress=()=>{
        const mobile=window.matchMedia('(max-width:600px)').matches;
        const scrollY=window.scrollY||window.pageYOffset||0;
        const header=document.querySelector('.site-header')?.getBoundingClientRect().height||(window.innerWidth<=900?58:72);
        if(mobile){
            sticky.classList.remove('is-pinned','is-released');
            sequence.style.height='auto';
            const vh=window.innerHeight||document.documentElement.clientHeight;
            if(reduced){
                product.style.setProperty('--hero-x','0px');
                product.style.setProperty('--hero-y','0px');
                product.style.setProperty('--hero-r','0deg');
                product.style.setProperty('--hero-s','1');
                applyLayer('left',1,-1);
                applyLayer('right',1,1);
                return;
            }
            const productRect=product.getBoundingClientRect();
            const productStart=vh*.96;
            const productEnd=vh*.40;
            const productProgress=ease(clamp((productStart-productRect.top)/Math.max(1,productStart-productEnd),0,1));
            product.style.setProperty('--hero-x',`${lerp(42,0,productProgress).toFixed(2)}px`);
            product.style.setProperty('--hero-y',`${lerp(12,0,productProgress).toFixed(2)}px`);
            product.style.setProperty('--hero-r',`${lerp(8,0,productProgress).toFixed(2)}deg`);
            product.style.setProperty('--hero-s',lerp(.82,1,productProgress).toFixed(4));
            const revealProgress=layer=>{
                const rect=layer.getBoundingClientRect();
                const start=vh*.90;
                const end=vh*.48;
                return clamp((start-rect.top)/Math.max(1,start-end),0,1);
            };
            applyLayer('left',revealProgress(leftLayer),-1);
            applyLayer('right',revealProgress(rightLayer),1);
            return;
        }

        const pinDistance=320;
        sticky.classList.remove('is-pinned','is-released');
        const stickyHeight=sticky.offsetHeight;
        const vh=window.innerHeight||document.documentElement.clientHeight;
        const availableHeight=Math.max(1,vh-header);
        const pinTop=header+Math.max(0,(availableHeight-stickyHeight)/2);
        sequence.style.height=`${stickyHeight+pinDistance}px`;
        const seqRect=sequence.getBoundingClientRect();
        const stageTop=scrollY+seqRect.top;
        const pinStart=Math.max(0,stageTop-pinTop);
        const pinEnd=pinStart+pinDistance;
        sequence.style.setProperty('--hero-pin-top',`${pinTop}px`);
        sequence.style.setProperty('--hero-pin-left',`${seqRect.left}px`);
        sequence.style.setProperty('--hero-pin-width',`${seqRect.width}px`);
        sequence.style.setProperty('--hero-pin-distance',`${pinDistance}px`);
        if(reduced){
            product.style.setProperty('--hero-x','0px');
            product.style.setProperty('--hero-y','0px');
            product.style.setProperty('--hero-r','0deg');
            product.style.setProperty('--hero-s','1');
            applyLayer('left',1,-1);
            applyLayer('right',1,1);
            return;
        }
        const intro=ease(clamp(scrollY/650,0,1));
        product.style.setProperty('--hero-x',`${lerp(window.innerWidth*.48,0,intro).toFixed(2)}px`);
        product.style.setProperty('--hero-y',`${lerp(-118,0,intro).toFixed(2)}px`);
        product.style.setProperty('--hero-r',`${lerp(30,0,intro).toFixed(2)}deg`);
        product.style.setProperty('--hero-s',lerp(.55,1,intro).toFixed(4));
        if(scrollY>=pinStart&&scrollY<=pinEnd)sticky.classList.add('is-pinned');
        else if(scrollY>pinEnd)sticky.classList.add('is-released');
        const pinned=clamp((scrollY-pinStart)/pinDistance,0,1);
        applyLayer('left',pinned,-1);
        applyLayer('right',clamp((pinned-.035)/.965,0,1),1);
    };

    let ticking=false;
    const request=()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{ticking=false;setProgress()});
    };

    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    window.addEventListener('load',request,{once:true});
    setProgress();
})();

(() => {
    if (!document.body.classList.contains('home-landing')) return;
    const example=document.querySelector('.assistant-example');
    const panel=example?.closest('.dark-panel');
    if(!example||!panel)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
    const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
    const lerp=(start,end,progress)=>start+(end-start)*progress;
    const update=()=>{
        const mobile=window.matchMedia('(max-width:600px)').matches;
        if(reduced){
            example.style.setProperty('--assistant-scale',mobile?'1.10':'1.38');
            example.style.setProperty('--assistant-y',mobile?'8px':'-42px');
            example.style.setProperty('--assistant-r','-4.5deg');
            return;
        }
        const vh=window.innerHeight||document.documentElement.clientHeight;
        const rect=panel.getBoundingClientRect();
        const startTop=Math.max(0,vh-rect.height);
        const endTop=mobile?(vh*.40)-(rect.height*.5):(vh*.5)-(rect.height*.5)-50;
        const raw=clamp((startTop-rect.top)/Math.max(1,startTop-endTop),0,1);
        const p=raw*raw*(3-2*raw);
        const scaleStart=mobile?.78:.70;
        const scaleEnd=mobile?1.12:1.38;
        const yStart=mobile?34:44;
        const yEnd=mobile?6:-42;
        example.style.setProperty('--assistant-scale',lerp(scaleStart,scaleEnd,p).toFixed(4));
        example.style.setProperty('--assistant-y',`${lerp(yStart,yEnd,p).toFixed(2)}px`);
        example.style.setProperty('--assistant-r',`${lerp(0,-5,raw).toFixed(2)}deg`);
    };
    let ticking=false;
    const request=()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(()=>{ticking=false;update()});
    };
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    update();
})();

(() => {
    if (!document.body.classList.contains('home-landing')) return;
    const stage=document.querySelector('[data-analytics-showcase]');
    if(!stage)return;
    const shots=[...stage.querySelectorAll('.analytics-shot')];
    if(shots.length!==2)return;

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
    const smooth=t=>t*t*(3-2*t);
    const lerp=(a,b,t)=>a+(b-a)*t;

    if(reduced){
        shots.forEach(shot=>{
            shot.style.setProperty('--analytics-x','0px');
            shot.style.setProperty('--analytics-y','0px');
            shot.style.setProperty('--analytics-r','0deg');
            shot.style.setProperty('--analytics-s','1');
            shot.style.setProperty('--analytics-opacity','1');
        });
        return;
    }

    let ticking=false;
    const update=()=>{
        ticking=false;
        const vh=window.innerHeight||document.documentElement.clientHeight;
        const rect=stage.getBoundingClientRect();
        const mobile=window.matchMedia('(max-width:700px)').matches;
        const start=vh*(mobile?.92:.91);
        const end=vh*(mobile?.34:.30);
        const base=clamp((start-rect.top)/Math.max(1,start-end),0,1);

        const starts=mobile
            ? [{x:-70,y:42,r:-3.5,s:.90},{x:72,y:56,r:3.5,s:.90}]
            : [{x:-300,y:74,r:-4.5,s:.86},{x:320,y:108,r:4.5,s:.86}];

        shots.forEach((shot,index)=>{
            const delay=index*.10;
            const local=clamp((base-delay)/(1-delay),0,1);
            const p=smooth(local);
            const s=starts[index];
            shot.style.setProperty('--analytics-x',`${lerp(s.x,0,p).toFixed(2)}px`);
            shot.style.setProperty('--analytics-y',`${lerp(s.y,0,p).toFixed(2)}px`);
            shot.style.setProperty('--analytics-r',`${lerp(s.r,0,p).toFixed(2)}deg`);
            shot.style.setProperty('--analytics-s',lerp(s.s,1,p).toFixed(4));
            shot.style.setProperty('--analytics-opacity',lerp(.32,1,p).toFixed(3));
        });
    };
    const request=()=>{if(ticking)return;ticking=true;requestAnimationFrame(update)};
    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    update();
})();

(() => {
    if (!document.body.classList.contains('home-landing')) return;
    const story=document.querySelector('[data-campus-story]');
    const section=document.querySelector('.campus-section');
    if(!story||!section)return;

    const inner=section.querySelector('.campus-inner');
    const sticky=story.querySelector('.campus-story-sticky');
    const slides=[...story.querySelectorAll('.campus-story-slide')];
    const steps=[...story.querySelectorAll('.campus-story-step')];
    const captions=[...story.querySelectorAll('.campus-story-caption-item')];
    if(!inner||!sticky||slides.length!==3||steps.length!==3||captions.length!==3)return;

    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clamp=(v,min,max)=>Math.min(max,Math.max(min,v));
    const smooth=t=>t*t*(3-2*t);
    const lerp=(a,b,t)=>a+(b-a)*t;

    const setSlide=(slide,x,scale,shadow,calloutOpacity)=>{
        slide.style.setProperty('--campus-story-x',`${x.toFixed(2)}%`);
        slide.style.setProperty('--campus-story-scale',scale.toFixed(4));
        slide.style.setProperty('--campus-story-shadow',shadow.toFixed(3));
        slide.style.setProperty('--campus-callout-opacity',calloutOpacity.toFixed(3));
    };

    const renderProgress=(p,mobile)=>{
        const phase1=smooth(clamp((p-(mobile?.02:.12))/(mobile?.40:.30),0,1));
        const phase2=smooth(clamp((p-(mobile?.50:.54))/(mobile?.40:.30),0,1));

        setSlide(slides[0],0,lerp(1,.972,phase1),lerp(1,.72,phase1),1);
        setSlide(slides[1],lerp(110,0,phase1),lerp(1.01,1,phase1)-lerp(0,.025,phase2),lerp(.15,1,phase1)-lerp(0,.25,phase2),smooth(clamp((phase1-.55)/.45,0,1))*(1-phase2));
        setSlide(slides[2],lerp(110,0,phase2),lerp(1.01,1,phase2),lerp(.15,1,phase2),smooth(clamp((phase2-.55)/.45,0,1)));

        const active=mobile?(p<.30?0:(p<.70?1:2)):(p<.34?0:(p<.76?1:2));
        steps.forEach((step,index)=>step.classList.toggle('is-active',index===active));
        captions.forEach((caption,index)=>caption.classList.toggle('is-active',index===active));
    };

    if(reduced){
        renderProgress(0,false);
        return;
    }

    let ticking=false;
    let mobileProgress=0;
    let mobileLocked=false;
    let mobileCompleted=false;
    let lockY=0;
    let touchY=null;
    let suppressLockUntil=0;
    let savedBody=null;
    let savedHtmlOverscroll='';

    const isMobile=()=>window.matchMedia('(max-width:700px)').matches;

    const freezePage=()=>{
        if(mobileLocked||mobileCompleted||!isMobile()||performance.now()<suppressLockUntil)return;
        const triggerTop=82;
        const rect=story.getBoundingClientRect();
        lockY=Math.max(0,window.scrollY+rect.top-triggerTop);
        window.scrollTo(0,lockY);
        savedBody={
            position:document.body.style.position,
            top:document.body.style.top,
            left:document.body.style.left,
            right:document.body.style.right,
            width:document.body.style.width,
            overflow:document.body.style.overflow
        };
        savedHtmlOverscroll=document.documentElement.style.overscrollBehavior;
        document.body.style.position='fixed';
        document.body.style.top=`-${lockY}px`;
        document.body.style.left='0';
        document.body.style.right='0';
        document.body.style.width='100%';
        document.body.style.overflow='hidden';
        document.documentElement.style.overscrollBehavior='none';
        mobileLocked=true;
        renderProgress(mobileProgress,true);
    };

    const unfreezePage=(forward)=>{
        if(!mobileLocked)return;
        const restore=savedBody||{};
        const targetY=forward?lockY+3:Math.max(0,lockY-6);
        const html=document.documentElement;
        const previousScrollBehavior=html.style.scrollBehavior;
        const previousOverflowAnchor=html.style.overflowAnchor;

        html.style.scrollBehavior='auto';
        html.style.overflowAnchor='none';
        document.body.style.position=restore.position||'';
        document.body.style.top=restore.top||'';
        document.body.style.left=restore.left||'';
        document.body.style.right=restore.right||'';
        document.body.style.width=restore.width||'';
        document.body.style.overflow=restore.overflow||'';
        html.style.overscrollBehavior=savedHtmlOverscroll||'';
        window.scrollTo({top:targetY,left:0,behavior:'auto'});

        mobileLocked=false;
        touchY=null;
        suppressLockUntil=performance.now()+260;
        if(forward){
            mobileProgress=1;
            mobileCompleted=true;
            renderProgress(1,true);
        }else{
            mobileProgress=0;
            mobileCompleted=false;
            renderProgress(0,true);
        }

        requestAnimationFrame(()=>{
            window.scrollTo({top:targetY,left:0,behavior:'auto'});
            requestAnimationFrame(()=>{
                html.style.scrollBehavior=previousScrollBehavior;
                html.style.overflowAnchor=previousOverflowAnchor;
            });
        });
    };

    const applyMobileDelta=(delta)=>{
        if(!mobileLocked||!delta)return;
        const prev=mobileProgress;
        mobileProgress=clamp(mobileProgress+delta/520,0,1);
        renderProgress(mobileProgress,true);
        if(delta>0&&prev<1&&mobileProgress>=1)unfreezePage(true);
        else if(delta<0&&prev>0&&mobileProgress<=0)unfreezePage(false);
    };

    const onWheel=e=>{
        if(!mobileLocked)return;
        e.preventDefault();
        applyMobileDelta(e.deltaY);
    };

    const onTouchStart=e=>{
        if(!mobileLocked||!e.touches.length)return;
        touchY=e.touches[0].clientY;
    };

    const onTouchMove=e=>{
        if(!mobileLocked||touchY===null||!e.touches.length)return;
        const y=e.touches[0].clientY;
        const delta=touchY-y;
        touchY=y;
        e.preventDefault();
        applyMobileDelta(delta);
    };

    const onTouchEnd=()=>{touchY=null;};

    const update=()=>{
        ticking=false;
        const mobile=isMobile();
        const wide=window.matchMedia('(min-width:1101px)').matches;

        if(mobile){
            story.style.removeProperty('height');
            story.style.removeProperty('min-height');
            if(mobileLocked)unfreezePage(false);
            mobileCompleted=false;
            mobileProgress=0;
            slides.forEach(slide=>{
                slide.style.setProperty('--campus-story-x','0%');
                slide.style.setProperty('--campus-story-scale','1');
                slide.style.setProperty('--campus-story-shadow','0');
                slide.style.setProperty('--campus-callout-opacity','0');
            });
            steps.forEach(step=>step.classList.remove('is-active'));
            captions.forEach(caption=>caption.classList.remove('is-active'));
            return;
        }

        if(mobileLocked)unfreezePage(false);
        mobileCompleted=false;
        mobileProgress=0;

        let p=0;
        if(wide){
            story.style.removeProperty('height');
            story.style.removeProperty('min-height');
            const rect=section.getBoundingClientRect();
            const stickyTop=parseFloat(getComputedStyle(inner).top)||0;
            const travel=Math.max(1,section.offsetHeight-inner.offsetHeight);
            p=clamp((stickyTop-rect.top)/travel,0,1);
        }else{
            story.style.removeProperty('height');
            story.style.removeProperty('min-height');
            const stickyTop=parseFloat(getComputedStyle(sticky).top)||0;
            const rect=story.getBoundingClientRect();
            const travel=Math.max(1,story.offsetHeight-sticky.offsetHeight-stickyTop);
            p=clamp((stickyTop-rect.top)/travel,0,1);
        }
        renderProgress(p,false);
    };

    const request=()=>{
        if(ticking)return;
        ticking=true;
        requestAnimationFrame(update);
    };

    window.addEventListener('scroll',request,{passive:true});
    window.addEventListener('resize',request);
    window.addEventListener('wheel',onWheel,{passive:false});
    window.addEventListener('touchstart',onTouchStart,{passive:true});
    window.addEventListener('touchmove',onTouchMove,{passive:false});
    window.addEventListener('touchend',onTouchEnd,{passive:true});
    window.addEventListener('touchcancel',onTouchEnd,{passive:true});
    update();
})();

const campusTabs=[...document.querySelectorAll('.v71-campus-tabs [role="tab"]')];
if(campusTabs.length){
    const activateCampusTab=(tab,focus=false)=>{
        campusTabs.forEach(item=>{
            const active=item===tab;
            item.setAttribute('aria-selected',String(active));
            item.tabIndex=active?0:-1;
            const panel=document.getElementById(item.getAttribute('aria-controls'));
            if(panel)panel.hidden=!active;
        });
        if(focus)tab.focus();
    };
    campusTabs.forEach((tab,index)=>{
        tab.addEventListener('click',()=>activateCampusTab(tab));
        tab.addEventListener('keydown',event=>{
            let next=index;
            if(event.key==='ArrowRight')next=(index+1)%campusTabs.length;
            else if(event.key==='ArrowLeft')next=(index+campusTabs.length-1)%campusTabs.length;
            else if(event.key==='Home')next=0;
            else if(event.key==='End')next=campusTabs.length-1;
            else return;
            event.preventDefault();
            activateCampusTab(campusTabs[next],true);
        });
    });
}

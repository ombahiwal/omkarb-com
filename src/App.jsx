import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { profile } from './data/profile.js';
import { Hero } from './components/Hero.jsx';
import { Section } from './components/Section.jsx';
import { Timeline } from './components/Timeline.jsx';
import { Stacks } from './components/Stacks.jsx';
import { Education } from './components/Education.jsx';
import { Awards } from './components/Awards.jsx';
import { Associations } from './components/Associations.jsx';
import { Footer } from './components/Footer.jsx';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const shellRef = useRef(null);

  useLayoutEffect(() => {
    let cleanupFooterAnimation = () => {};

    const ctx = gsap.context(() => {
      gsap.from('.js-stagger', {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08
      });

      gsap.utils.toArray('.js-reveal').forEach((section) => {
        gsap.from(section, {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 84%'
          }
        });
      });

      gsap.fromTo(
        '.timeline-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
            end: 'bottom 24%',
            scrub: 0.35
          }
        }
      );

      gsap.utils.toArray('.timeline-item').forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0.42 },
          {
            autoAlpha: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              end: 'top 60%',
              scrub: true
            }
          }
        );

        ScrollTrigger.create({
          trigger: item,
          start: 'top 58%',
          end: 'bottom 44%',
          toggleClass: { targets: item, className: 'is-active' }
        });
      });

      const tspTl = gsap.timeline({ repeat: -1, repeatDelay: 1.1 });

      tspTl
        .set('.route-edge--initial', {
          autoAlpha: 0.62,
          stroke: 'rgba(0, 0, 0, 0.55)',
          strokeWidth: 0.32
        })
        .set('.route-edge--optimized', {
          autoAlpha: 0,
          stroke: '#00d76f',
          strokeWidth: 0.9,
          strokeDashoffset: 22
        })
        .set('.tsp-city', {
          scale: 1,
          fill: '#050505',
          transformOrigin: '50% 50%'
        })
        .to('.route-edge--removed', {
          stroke: '#00d76f',
          autoAlpha: 0.95,
          strokeWidth: 0.88,
          duration: 0.38,
          stagger: 0.06
        })
        .to('.route-edge--removed', {
          autoAlpha: 0.08,
          duration: 0.38,
          ease: 'power1.out'
        })
        .to(
          '.route-edge--initial',
          {
            autoAlpha: 0.16,
            duration: 0.42,
            ease: 'sine.out'
          },
          '<'
        )
        .to(
          '.route-edge--optimized',
          {
            autoAlpha: 1,
            strokeDashoffset: 0,
            duration: 0.64,
            stagger: 0.05,
            ease: 'power2.out'
          },
          '-=0.1'
        )
        .to(
          '.route-edge--added',
          {
            stroke: '#00d76f',
            strokeWidth: 0.9,
            duration: 0.26,
            stagger: 0.05,
            ease: 'power1.out'
          },
          '<'
        )
        .to(
          '.tsp-city',
          {
            scale: 1.45,
            fill: '#00d76f',
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            stagger: 0.045,
            ease: 'power2.inOut'
          },
          '-=0.02'
        )
        .to('.route-edge--optimized', {
          autoAlpha: 1,
          duration: 0.7,
          ease: 'sine.inOut'
        });

      const linkedSearch = shellRef.current?.querySelector('.linked-search');
      const searchCursor = linkedSearch?.querySelector('.search-cursor');
      const nodes = linkedSearch ? Array.from(linkedSearch.querySelectorAll('.list-node')) : [];

      if (linkedSearch && searchCursor && nodes.length > 0 && !window.matchMedia('(max-width: 900px)').matches) {
        let linkedTl;

        const resetNodeStyle = {
          autoAlpha: 1,
          borderColor: 'rgba(0, 0, 0, 1)',
          backgroundColor: 'rgba(249, 234, 220, 1)',
          color: '#050505'
        };

        const getCursorTarget = (node) => {
          const nodeRect = node.getBoundingClientRect();
          const parentRect = linkedSearch.getBoundingClientRect();
          return {
            x: nodeRect.left - parentRect.left + nodeRect.width / 2,
            y: nodeRect.top - parentRect.top + nodeRect.height / 2
          };
        };

        const playLinkedSearch = () => {
          linkedTl?.kill();
          gsap.killTweensOf(searchCursor);
          gsap.set(nodes, resetNodeStyle);

          const start = getCursorTarget(nodes[0]);
          gsap.set(searchCursor, { x: start.x, y: start.y, autoAlpha: 1 });

          linkedTl = gsap.timeline({ repeat: -1, repeatDelay: 0.55 });

          nodes.forEach((node) => {
            const target = getCursorTarget(node);

            linkedTl
              .to(searchCursor, {
                x: target.x,
                y: target.y,
                duration: 0.38,
                ease: 'power2.inOut'
              })
              .to(
                node,
                {
                  autoAlpha: 1,
                  borderColor: 'rgba(0, 0, 0, 1)',
                  backgroundColor: '#00d76f',
                  color: '#050505',
                  duration: 0.2
                },
                '<'
              )
              .to(node, resetNodeStyle, '+=0.28');
          });
        };

        playLinkedSearch();
        const onResize = () => playLinkedSearch();
        window.addEventListener('resize', onResize);

        cleanupFooterAnimation = () => {
          linkedTl?.kill();
          gsap.killTweensOf(searchCursor);
          window.removeEventListener('resize', onResize);
        };
      }
    }, shellRef);

    return () => {
      cleanupFooterAnimation();
      ctx.revert();
    };
  }, []);

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="layout-grid">
        <Hero profile={profile} />

        <Section id="experience" className="span-12 section-experience" index="01" title="Experience" meta="Research, product, and system delivery across Europe + India">
          <Timeline items={profile.experience} />
        </Section>

        <Section id="stacks" className="span-6" index="02" title="Stacks" meta="Tools I ship with">
          <Stacks programming={profile.programming} languages={profile.languages} />
        </Section>

        <Section id="education" className="span-6" index="03" title="Education" meta="Computer science, service systems, and exchange research">
          <Education items={profile.education} />
        </Section>

        <Section id="awards" className="span-6" index="04" title="Awards" meta="National-stage recognition">
          <Awards items={profile.awards} />
        </Section>

        <Section id="communities" className="span-6" index="05" title="Communities" meta="Builder-led student initiatives">
          <Associations items={profile.associations} />
        </Section>

        <Footer profile={profile} />
      </div>
    </div>
  );
}

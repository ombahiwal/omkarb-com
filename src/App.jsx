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
    let cleanupMasonry = () => {};

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
          stroke: 'rgba(224, 220, 208, 0.75)',
          strokeWidth: 0.32
        })
        .set('.route-edge--optimized', {
          autoAlpha: 0,
          stroke: '#f04d31',
          strokeWidth: 0.9,
          strokeDashoffset: 22
        })
        .set('.tsp-city', {
          scale: 1,
          fill: '#d7d2c7',
          transformOrigin: '50% 50%'
        })
        .to('.route-edge--removed', {
          stroke: '#f04d31',
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
            stroke: '#f04d31',
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
            fill: '#f04d31',
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
          autoAlpha: 0.56,
          borderColor: 'rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(16, 16, 14, 0.92)',
          color: '#cbc7be'
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
                  borderColor: 'rgba(240, 77, 49, 0.86)',
                  backgroundColor: 'rgba(240, 77, 49, 0.18)',
                  color: '#f3eee4',
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

    const grid = shellRef.current?.querySelector('.layout-grid');
    const gridItems = grid ? Array.from(grid.children) : [];

    if (grid && gridItems.length > 0) {
      const relayoutMasonry = () => {
        if (!window.matchMedia('(min-width: 1081px)').matches) {
          gridItems.forEach((item) => {
            item.style.gridRowEnd = 'auto';
          });
          return;
        }

        const gridStyles = window.getComputedStyle(grid);
        const autoRow = Number.parseFloat(gridStyles.getPropertyValue('grid-auto-rows')) || 8;
        const rowGap = Number.parseFloat(gridStyles.getPropertyValue('row-gap')) || 16;

        gridItems.forEach((item) => {
          item.style.gridRowEnd = 'auto';
        });

        gridItems.forEach((item) => {
          const height = item.getBoundingClientRect().height;
          const span = Math.ceil((height + rowGap) / (autoRow + rowGap));
          item.style.gridRowEnd = `span ${Math.max(1, span)}`;
        });
      };

      relayoutMasonry();
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(relayoutMasonry);
      });
      gridItems.forEach((item) => resizeObserver.observe(item));
      window.addEventListener('resize', relayoutMasonry);
      const delayedRelayout = window.setTimeout(relayoutMasonry, 220);

      cleanupMasonry = () => {
        window.clearTimeout(delayedRelayout);
        resizeObserver.disconnect();
        window.removeEventListener('resize', relayoutMasonry);
      };
    }

    return () => {
      cleanupFooterAnimation();
      cleanupMasonry();
      ctx.revert();
    };
  }, []);

  return (
    <div className="app-shell" ref={shellRef}>
      <div className="layout-grid">
        <Hero profile={profile} />

        <Section className="span-8 section-experience" index="01" title="Experience" meta="Research, product, and system delivery across Europe + India">
          <Timeline items={profile.experience} />
        </Section>

        <Section className="span-4" index="02" title="Stacks" meta="Tools I ship with">
          <Stacks programming={profile.programming} languages={profile.languages} />
        </Section>

        <Section className="span-4" index="03" title="Education" meta="Computer science, service systems, and exchange research">
          <Education items={profile.education} />
        </Section>

        <Section className="span-4" index="04" title="Awards" meta="National-stage recognition">
          <Awards items={profile.awards} />
        </Section>

        <Section className="span-6" index="05" title="Communities" meta="Builder-led student initiatives">
          <Associations items={profile.associations} />
        </Section>

        <Footer profile={profile} />
      </div>
    </div>
  );
}

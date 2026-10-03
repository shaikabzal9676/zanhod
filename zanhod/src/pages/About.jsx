import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import Navbar from "../components/Navbar";

import "../styles/about.css";

function About() {
  return (
    <div className="site">
      <Navbar />

      <main className="about-page">

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-content">
            <p className="about-eyebrow">
              ZANHOD / ABOUT
            </p>

            <h1>
              WEAR
              <br />
              YOUR
              <br />
              DIFFERENCE.
            </h1>

            <p className="about-hero-text">
              ZANHOD is a premium streetwear brand built
              around distinctive design, everyday comfort,
              and limited collections.
            </p>
          </div>

          <div className="about-hero-side">
            <span>EST. 2026</span>
            <span>INDIA</span>
          </div>

        </section>


        {/* OUR STORY */}
        <section className="about-story">

          <div className="about-section-label">
            01 / OUR STORY
          </div>

          <div className="about-story-grid">

            <div className="about-story-heading">
              <h2>
                CLOTHING
                <br />
                WITH
                <br />
                IDENTITY.
              </h2>
            </div>

            <div className="about-story-content">

              <p className="about-lead">
                ZANHOD was created with a simple goal:
                to build streetwear that feels different
                without trying too hard.
              </p>

              <p>
                We believe the best pieces are the ones
                that become part of your everyday wardrobe.
                Strong enough to stand out, comfortable
                enough to keep wearing.
              </p>

              <p>
                Instead of building an endless catalogue,
                ZANHOD focuses on limited drops with a
                carefully selected range of designs.
              </p>

              <p>
                Drop 01 marks the beginning of that journey.
              </p>

            </div>

          </div>

        </section>


        {/* WHAT WE FOCUS ON */}
        <section className="about-focus">

          <div className="about-section-label">
            02 / WHAT WE FOCUS ON
          </div>

          <div className="about-focus-grid">

            <article className="about-focus-card">
              <span>01</span>

              <div>
                <h3>DESIGN</h3>

                <p>
                  Clean silhouettes, considered graphics
                  and a darker visual language define the
                  ZANHOD aesthetic.
                </p>
              </div>
            </article>


            <article className="about-focus-card">
              <span>02</span>

              <div>
                <h3>COMFORT</h3>

                <p>
                  Streetwear should feel as good as it
                  looks. Our pieces are designed for
                  everyday movement and easy styling.
                </p>
              </div>
            </article>


            <article className="about-focus-card">
              <span>03</span>

              <div>
                <h3>LIMITED DROPS</h3>

                <p>
                  We keep collections focused rather than
                  constantly adding new designs. Each drop
                  has its own identity.
                </p>
              </div>
            </article>

          </div>

        </section>


        {/* PRODUCT APPROACH */}
        <section className="about-product">

          <div className="about-product-number">
            03
          </div>

          <div className="about-product-content">

            <div className="about-section-label">
              03 / THE ZANHOD APPROACH
            </div>

            <h2>
              BUILT FOR
              <br />
              EVERYDAY
              <br />
              STREETWEAR.
            </h2>

            <p>
              From the fit to the visual details, every
              ZANHOD piece is designed to work beyond
              a single occasion.
            </p>

            <p>
              Pair it with your everyday rotation,
              layer it through colder days, or make it
              the centre of the outfit.
            </p>

          </div>

        </section>


        {/* DROP 01 */}
        <section className="about-drop">

          <div className="about-drop-top">
            <span>04 / FIRST COLLECTION</span>
            <span>DROP 01</span>
          </div>

          <div className="about-drop-content">

            <div>
              <p className="about-drop-label">
                ZANHOD / DROP 01
              </p>

              <h2>
                SIX
                <br />
                DESIGNS.
              </h2>
            </div>

            <div className="about-drop-copy">

              <p>
                Six designs introduce the first ZANHOD
                collection — a focused lineup created
                for the colder season.
              </p>

              <p>
                Each piece carries its own character while
                staying within the visual world of ZANHOD.
              </p>

              <Link
                to="/drop-01"
                className="about-button"
              >
                EXPLORE DROP 01
                <ArrowUpRight size={17} />
              </Link>

            </div>

          </div>

        </section>


        {/* FINAL CTA */}
        <section className="about-final">

          <p className="about-final-label">
            ZANHOD / 2026
          </p>

          <h2>
            FIND YOUR
            <br />
            PIECE.
          </h2>

          <p>
            Explore Drop 01 and discover the first
            ZANHOD collection.
          </p>

          <Link
            to="/shop"
            className="about-final-button"
          >
            SHOP ZANHOD
            <ArrowUpRight size={18} />
          </Link>

        </section>

      </main>
    </div>
  );
}

export default About;

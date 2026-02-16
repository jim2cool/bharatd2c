> Last updated: 2026-02-27 — 18 Moods (English) & 24 Categories added.

The Product & Design System Reference

*How the Intelligence Layer and Design System Work as One*

Version 1.0 Â· Confidential Â· 2026 Â· For Designers, Product Collaborators
and Onboarding Writers

**1. How the System Works**

Every Easy D2C store is the product of six layers working in sequence.
Each layer has a single job. No lower layer can break the one above it.
The output is deterministic --- given the same seller inputs, the system
always produces the same store configuration. The design intent is
expressed not through a designer\'s decisions but through the
architecture itself.

  ----------- -------------- ------------------------------------- -----------------
  **Layer**   **Name**       **Job**                               **Who Controls
                                                                   It**

  1           Commerce       Defines the structural skeleton of    System --- chosen
              Architecture   the store --- zone layout, conversion at onboarding,
                             invariants, page structure. Product   locked thereafter
                             Engine, Story-First, or               
                             Catalog-First.                        

  2           Intelligence   The computed brain. Scores the seller System ---
              Layer          against 78 archetypes, derives buyer  recomputed when
                             hesitation and traffic source, runs   seller profile
                             97 activation rules and 63 archetype  updates
                             overrides. Produces the store\'s      
                             component sequence, above-fold        
                             composition, urgency mechanic, CTA    
                             behaviour, and trust density.         

  3           Seller         Conversion intensity settings.        System ---
              Modifier       Urgency level, trust density, CTA     applied
                             prominence, COD bias, density scale.  automatically
                             Computed by the intelligence layer    from archetype
                             from the seller\'s archetype --- not  
                             manually set by the seller.           

  4           Category       Fires the mandatory modules for the   System ---
              Modifier       seller\'s product category. 24        mandatory, cannot
                             categories covered, 71 specific       be suppressed
                             component-category requirements.      

  5    **5**       Mood Card      The complete visual language. **18 mood cards**, Seller --- chosen
                               each renamed to English industry parlance. at onboarding,
                             Every component, from any source, is  changeable any
                             absorbed and expressed in the mood    time
                             card\'s visual language.              

  6           Seller         The seller\'s deliberate              Seller --- with
              Override Layer customisations on top of the system   system guardrails
                             recommendation. System opinion given  
                             before every action. 25 LOCKED        
                             components cannot be overridden.      
  ----------- -------------- ------------------------------------- -----------------

> ***The system's job is to make the best decision for the seller's
> specific buyer psychology. The seller's job is to provide the raw
> material --- their identity, their product, their category. The layer
> between them is conversion science.***

**1.4 Universal Translation: Micro-Interactions & Iconography**

To ensure brand consistency at every level, the system translates the **18 Mood 
Cards** into specific micro-behaviors and iconography styles.

1. **Micro-Interactions:** Hover states, active/tap effects, and focus rings are 
   governed by four design tokens: `--opacity-hover`, `--scale-hover`, 
   `--shadow-active`, and `--border-focus`. This ensures a "Dhamaka" hover feels 
   bouncy and aggressive (higher scale), while "Shaahi" feels static and luxury 
   (lower scale, opacity only).
2. **Iconography Architecture:** Every icon is rendered via a mood-card-aware 
   wrapper. The `icon_set` token chooses the family (e.g., "Sharp", "Rounded", 
   "Duotone"), while `icon_weight` and `icon_style` fine-tune the stroke and 
   fill. This prevents "modern" icons from appearing on a "Traditional" brand 
   site.

**2. The Onboarding Flow**


The onboarding flow is the primary data collection mechanism. Every
question maps directly to a scoring dimension that the intelligence
layer uses to compute the store configuration. The flow is tap-based ---
no typing required. The entire flow takes under 4 minutes.

Questions are asked in professional English. The visual language is icon-led, replacing standard emojis with a curated Lucide icon set. The emotional framing
is conversational, not clinical. The seller is not filling a form ---
they are telling their story.

**The 15 Onboarding Inputs**

  ------- ------------ --------------- -------------- ---------------------------------
  **Q**   **Input      **Question      **Format**     **What It Drives**
          Name**       (English)**                    

  1.1     Seller       What\'s your    Single select  Primary archetype cluster
          Identity     deal?           --- 10 options assignment. Sets the entire
                                                      intelligence layer direction.

  2.1     Product Type What are you    Single select  Category modifier. Which of the
                       primarily       --- 24         71 category-mandatory components
                       selling?        categories     fire.

  2.2     Product      Which specific  Single select  Sub-category precision for
          Sub-Type     type are you    ---            component activation rules.
                       selling?        conditional by 
                                       category       

  2.3     Product      How many        Single select  Commerce architecture hint. 1--3
          Count        products are    --- 4 bands    â†’ Product Engine, 100+ â†’
                       you selling?                   Catalog-First tendency.

  2.4     Price Range  What is your    Single select  Urgency mechanic calibration.
                       typical price   --- 4 bands    Price justification hesitation
                       range?                         weighting. Mood card fit scoring.

  2.5     Product      Do your         Multi-select   Size Guide activation. Variant
          Variants     products come   --- 6 options  selector configuration.
                       in variations?                 

  3.1     Business     How much are    Single select  Business maturity scoring. Trust
          Maturity     you currently   --- 5 stages   bar prominence. Return policy
          Stage        selling?                       emphasis.

  3.2     Monthly      Roughly what is Single select  Maturity tier fine-tuning.
          Revenue      your monthly    --- 6 bands    Intelligence vs Standard feature
                       revenue?                       depth.

  3.3     Growth       What do you     Single select  Commerce architecture selection.
          Intent       want from this? --- 4 intents  Feature depth calibration.

  4.1     Site         What is the     Multi-select   Above-fold lead. Story section
          Priority     most important  ranked --- 10  prominence. Conversion vs brand
                       job for your    options        balance.
                       site?                          

  4.2     Mood Card    How should your Single select  Mood card selection. All 50+
                       site feel?      --- 18 mood    design tokens. Motion profile.
                                       cards (English) Content tone.

  6.1     Customer     Who is your     Multi-select   Persuasion sequence modifier.
          Type         typical         --- 10 buyer   Hesitation weighting. COD bias.
                       customer?       types          

  6.2     Purchase     Why do people   Multi-select   Trust component selection. Social
          Reason       buy from you?   --- 12 reasons proof type. Story section content
                                                      seeding.

  6.3     Customer     What makes your Multi-select   Primary driver of the persuasion
          Hesitation   customer        max 4 --- 15   sequence. Determines PDP zone
                       hesitate before hesitation     order. Above-fold lead. Urgency
                       buying?         types          mechanic.

  6.4     Traffic      Where will your Multi-select   Above-fold composition. First
          Source       customers find  --- 8 sources  impression architecture. CTA
                       you?                           behaviour.
  ------- ------------ --------------- -------------- ---------------------------------

**Q1.1 --- Seller Identity: The 10 Options**

This is the highest-leverage question in the flow. The answer sets the
initial archetype cluster assignment that the intelligence layer begins
with before any subsequent scoring refines it.

  ------------------- ------------------ ------------------------------------------
  **Value**           **Label            **Initial Cluster Direction**
                      (English)**        

  maker               I make it myself   Manufacturers & Producers or Heritage &
                                         Craft

  established_biz     I have an          Growth Stage or Offline Going Online
                      established        
                      business           

  reseller            I buy and resell   Arbitrage Players
                      products           

  social_seller       I sell on          Digital First
                      Instagram or       
                      WhatsApp           

  marketplace         I am on Amazon,    Arbitrage Players or Growth Stage
                      Flipkart or Meesho 

  dropshipper         I sell without     Arbitrage Players --- Pure Dropshipper
                      holding stock      

  new_brand           I want to build a  Growth Stage --- Early D2C Brand
                      new brand          

  passion_knowledge   I sell from        Passion & Lifestyle or Heritage & Craft
                      knowledge or       
                      passion            

  family_biz          Family or legacy   Offline Going Online
                      business going     
                      online             

  nri_exporter        Want to sell       Life Stage --- NRI Selling Indian Products
                      Indian products    
                      abroad             
  ------------------- ------------------ ------------------------------------------

**Q6.3 --- Customer Hesitation: The 15 Hesitation Types**

This is the question that drives the persuasion sequence. The seller
selects up to 4 hesitations their buyers commonly experience. These feed
directly into the ob_persuasion_sequences table and determine the PDP
zone order, above-fold lead, urgency mechanic, and CTA behaviour.

  ------------------------- --------------- ---------------------------------------
  **Value**                 **Label**       **What It Drives**

  price_justification       Why so          Story-first or evidence-first
                            expensive?      above-fold. CTA with offer treatment.

  unknown_brand             Who is this     Trust bar maximised. Seller face or
                            brand?          maker story leads above fold.

  quality_uncertainty       Will it be      Visual lead. Reviews Summary elevated.
                            good quality?   Photo reviews activated.

  logistics_trust           Will it be      COD badge and delivery estimate
                            delivered       prominent. Trust bar above fold.
                            safely?         

  delivery_timing           Will it arrive  Delivery date estimate above fold.
                            on time?        Urgency tied to timing, not scarcity.

  returns_anxiety           What if I need  Return Policy Highlight activated. COD
                            to return it?   badge prominent.

  fit_uncertainty           Will it fit     Size Guide mandatory. Size grid
                            correctly?      selector and detailed chart.

  ingredient_skepticism     Are ingredients Ingredient Block activated.
                            safe?           Certification badge. How-to-use
                                            section.

  low_social_proof          No reviews yet  Testimonials elevated. Empty-state
                                            review incentive CTA.

  cod_barrier               Is COD          COD badge above fold near CTA. CTA
                            available?      behaviour: with_cod_badge.

  authenticity_anxiety      Is it genuine   Authenticity Badge mandatory.
                            or fake?        Provenance story. GI tag if applicable.

  personalisation_anxiety   Is it right for Expert quote or practitioner story.
                            me?             Clinical proof or quiz.

  decision_paralysis        Too many        Comparison toggle. Specs table. Filter
                            options ---     bar prominence.
                            which one?      

  support_availability      Is anyone       WhatsApp Float Button. Contact CTA.
                            listening?      Support smart prompt.

  price_comparison          Cheaper         Price value lead. With-offer CTA.
                            elsewhere?      Highlights strip prominent.
  ------------------------- --------------- ---------------------------------------

**3. The 78 Seller Archetypes**

Every seller who completes onboarding is assigned to one of 78
archetypes across 13 clusters. The archetype assignment is computed by
the intelligence layer from the seller\'s onboarding answers --- it is
not chosen by the seller. The archetype determines which of 63
archetype-specific overrides apply, and which of the 10 persuasion
sequence cluster profiles govern the PDP structure.

Archetypes marked V1.1 Parked are defined in the system and reserved for
future activation. They are not currently active in the onboarding
scoring flow.

**Cluster 1 --- Arbitrage Players (7 archetypes)**

High COD dependency. High trust deficit. Paid social traffic dominant.
Conversion architecture is urgency-first, trust-heavy, scarcity-led.
Real-time sales pulse and stock counter are primary conversion
mechanics.

  -------- ---------------- ------------------ --------------- ---------- -------------------
  **ID**   **Archetype**    **Motivation**     **Trust         **COD      **Traffic**
                                               Deficit**       Likely**   

  1        Pure Dropshipper Margin and volume, High            Yes        Paid social
                            low risk entry                                

  2        Dropshipper      Reduce marketplace High            Yes        Paid social
           Supplier         dependence                                    

  3        Meesho / Social  Supplemental       Very High       Yes        WhatsApp
           Reseller         income, low                                   
                            investment                                    

  4        Marketplace      Margin             High            Yes        Organic search
           Reseller         improvement, avoid                            
                            fees                                          

  5        Multi-Platform   Maximise reach     High            Yes        Paid social
           Reseller         across all                                    
                            channels                                      

  6        White Label      Build perceived    Moderate-High   Yes        Paid social
           Reseller         brand at low cost                             

  7        Grey Market      Exploit price      Very High       Yes        Organic search
           Importer         arbitrage                                     
  -------- ---------------- ------------------ --------------- ---------- -------------------

**Cluster 2 --- Manufacturers & Producers (7 archetypes)**

Moderate to high trust deficit depending on maturity. COD tendency
varies. Organic search dominant. Architecture focuses on production
story, quality evidence, and direct-to-consumer narrative. Maker story
is the primary differentiator.

  -------- --------------- ------------------ -------------- ---------- ------------------
  **ID**   **Archetype**   **Motivation**     **Trust        **COD      **Traffic**
                                              Deficit**      Likely**   

  8        Small           Capture retail     Moderate       No         Organic search
           Manufacturer    margin, build                                
           Going D2C       brand                                        

  9        Home-Based      Monetise skill or  High           Yes        WhatsApp
           Producer        time from home                               

  10       Cottage         Supplement family  High           Yes        WhatsApp
           Industry        income through                               
                           craft                                        

  11       MSME / Factory  Add D2C margin,    Low-Moderate   No         Organic search
           Owner           reduce distributor                           
                           dependence                                   

  12       OEM Wanting Own Build              Moderate       No         Organic search
           Brand           consumer-facing                              
                           brand on OEM base                            

  13       Farmer Producer Fair price for     High           Yes        Organic social
           / FPO           produce, reduce                              
                           middlemen                                    

  14       Self Help Group Income for women   High           Yes        Organic social
           (SHG)           in the group                                 
  -------- --------------- ------------------ -------------- ---------- ------------------

**Cluster 3 --- Heritage & Craft (6 archetypes)**

Moderate trust deficit. Emotional story is the primary conversion
instrument. Countdown timers and sales pulse are suppressed --- they
damage authentic perception. Scarcity copy is reframed as craft scarcity
(\"Handcrafted in small batches\"). Provenance and process are elevated.

  -------- ---------------- ------------------ --------------- ---------- ----------------
  **ID**   **Archetype**    **Motivation**     **Trust         **COD      **Traffic**
                                               Deficit**       Likely**   

  15       Traditional      Reach buyers who   Moderate        No         Organic social
           Artisan          value authenticity                            
           (GI-Tagged)                                                    

  16       Regional Craft   Extend regional    Moderate-High   Yes        Organic social
           Seller           craft to wider                                
                            market                                        

  17       Heritage Food    Monetise heritage  Moderate        Yes        Organic social
           Producer         recipe at scale                               

  18       Handloom Weaver  Fair wage for      Moderate        No         Organic social
                            skill, reach                                  
                            conscious                                     
                            consumers                                     

  19       Tribal Art       Income for tribal  Moderate-High   Yes        Organic social
           Seller           community,                                    
                            cultural                                      
                            preservation                                  

  20       Sustainable /    Serve conscious    Moderate        No         Organic social
           Natural Products consumers, align                              
           Maker            commerce with                                 
                            values                                        
  -------- ---------------- ------------------ --------------- ---------- ----------------

**Cluster 4 --- Passion & Lifestyle (7 archetypes)**

Low to moderate trust deficit. Audience often already exists from the
practitioner\'s platform or practice. Expert authority is the primary
trust signal. The seller\'s face and credentials are elevated
above-fold. Urgency is light or absent.

  -------- --------------- ------------------ -------------- ---------- ------------------
  **ID**   **Archetype**   **Motivation**     **Trust        **COD      **Traffic**
                                              Deficit**      Likely**   

  21       Wellness        Extend wellness    Moderate       No         Organic social
           Practitioner    practice into                                
                           product revenue                              

  22       Fitness         Monetise fitness   Moderate       No         Organic social
           Professional    credibility                                  
                           through products                             

  23       Chef / Food     Monetise food      Low            No         Organic social
           Personality     authority through                            
                           packaged products                            

  24       Beauty          Share formulation  Moderate       No         Organic social
           Formulator      expertise, serve                             
                           conscious beauty                             
                           buyers                                       

  25       Pet Product     Serve passionate   Low-Moderate   No         Organic social
           Maker           pet owner                                    
                           community                                    

  26       Spiritual /     Serve spiritual    Moderate       No         Organic social
           Devotional      community,                                   
           Seller          preserve practice                            

  27       Hobbyist Turned Turn passion into  High           Yes        Organic social
           Seller          income                                       
  -------- --------------- ------------------ -------------- ---------- ------------------

**Cluster 5 --- Fashion & Design (7 archetypes)**

Moderate trust deficit. Size and fit hesitation is the dominant buyer
concern --- Size Guide is mandatory for all wearable sub-categories.
Fashion-specific components (Fabric Details, Care Instructions, Swatch
Variants, Exchange Trust Messaging) activate by category requirement.
Stock counter is appropriate as a scarcity signal.

  -------- --------------- ----------------- ----------- ---------- -------------------
  **ID**   **Archetype**   **Motivation**    **Trust     **COD      **Traffic**
                                             Deficit**   Likely**   

  28       Independent     Build a fashion   Moderate    No         Organic social
           Fashion         brand around                             
           Designer        creative vision                          

  29       Ethnic /        Serve             Moderate    No         Organic social
           Occasion Wear   occasion-driven                          
                           buyers at key                            
                           life moments                             

  30       Sustainable     Build conscious   Moderate    No         Organic social
           Fashion         fashion brand                            

  31       Accessories     Monetise craft    Moderate    No         Organic social
           Designer        and aesthetic                            
                           sensibility                              

  32       Kids Fashion    Serve parent      Moderate    No         Organic social
                           buyers who                               
                           prioritise safety                        
                           and quality                              

  33       Plus Size /     Serve underserved Moderate    No         Organic social
           Inclusive       market, build                            
           Fashion         community                                

  34       Customisation   Serve buyers who  Moderate    No         Organic social
           Seller          want personal and                        
                           unique products                          
  -------- --------------- ----------------- ----------- ---------- -------------------

**Cluster 6 --- Offline Going Online (7 archetypes)**

Low to moderate trust deficit. These sellers typically have strong
offline credibility that has not yet been translated to digital. The
architecture focuses on legitimacy signals, heritage narrative, and
reducing the perceived gap between offline quality and online trust. COD
dependency is mixed.

  -------- ---------------- ---------------- -------------- ---------- ------------------
  **ID**   **Archetype**    **Motivation**   **Trust        **COD      **Traffic**
                                             Deficit**      Likely**   

  35       Local Retail     Extend offline   Moderate       Yes        Organic search
           Shop             customer base,                             
                            survive digital                            
                            shift                                      

  36       Family Business  Modernise family Low-Moderate   No         Organic search
           Second           business, build                            
           Generation       for next                                   
                            generation                                 

  37       B2B Adding D2C   Add consumer     Low            No         Organic search
                            margin, reduce                             
                            B2B dependence                             

  38       Service Business Passive income   Low-Moderate   No         Organic search
           Adding Products  beyond service                             
                            hours                                      

  39       Regional Brand   Expand beyond    Low            No         Paid social
           Going National   regional                                   
                            geography                                  

  40       Export Adding    Capture domestic Low            No         Organic search
           Domestic         margin, reduce                             
                            export                                     
                            volatility                                 

  41       Franchise        Build            Moderate       No         Organic search
           Wanting Own      independent                                
           Brand            brand identity                             
                            and margin                                 
  -------- ---------------- ---------------- -------------- ---------- ------------------

**Cluster 7 --- Digital First (6 archetypes)**

Very low to low trust deficit --- audience already trusts the creator.
UGC feed and social proof from the creator\'s own channel are the
primary trust mechanisms. The seller\'s face leads above-fold. Urgency
is light --- the audience converts on affinity, not pressure. Video
asset activation expected.

  -------- --------------- ------------------ ----------- ---------- -------------------
  **ID**   **Archetype**   **Motivation**     **Trust     **COD      **Traffic**
                                              Deficit**   Likely**   

  42       Instagram       Monetise Instagram Low         No         Organic social
           Seller          audience with own                         
                           product                                   

  43       YouTube Creator Product revenue as Very Low    No         Organic social
                           diversification                           
                           from AdSense                              

  44       Influencer      Own the product    Very Low    No         Organic social
           Brand           margin, move                              
                           beyond sponsored                          
                           posts                                     

  45       WhatsApp        Serve tight-knit   Low         Yes        WhatsApp
           Community       community with                            
           Seller          trusted products                          

  46       Meme Page with  Monetise audience  Low         No         Organic social
           Products        beyond ads                                

  47       Podcast Host    Extend podcast     Low         No         Organic social
           with Products   brand into                                
                           tangible products                         
  -------- --------------- ------------------ ----------- ---------- -------------------

**Cluster 8 --- Life Stage (7 archetypes)**

High to very high trust deficit for most. These sellers are typically
very early in their business journey. Maximum trust density applied.
Full trust bar mandatory. Return policy prominently highlighted.
Architecture focuses on legitimacy before conversion.

  -------- --------------- ------------------ ----------- ---------- ------------------
  **ID**   **Archetype**   **Motivation**     **Trust     **COD      **Traffic**
                                              Deficit**   Likely**   

  48       Homemaker       Income from home,  High        Yes        WhatsApp
           Entrepreneur    flexibility around                        
                           family                                    

  49       Student         Build something    Very High   Yes        Organic social
           Entrepreneur    while studying,                           
                           prove concept                             

  50       Side Hustle     Build income       High        Yes        Organic social
           Seller          stream outside                            
                           main job                                  

  51       Retirement      Stay active,       Moderate    Yes        WhatsApp
           Venture         generate income,                          
                           share expertise                           

  52       Redundancy /    Replace lost       High        Yes        Organic search
           Career          income, rebuild                           
           Transition      through                                   
                           entrepreneurship                          

  53       NRI Selling     Connect diaspora   Moderate    No         Organic social
           Indian Products with authentic                            
                           Indian products                           

  54       Expat /         Build India-based  Moderate    No         Organic social
           Returnee        business with                             
                           international                             
                           standards                                 
  -------- --------------- ------------------ ----------- ---------- ------------------

**Cluster 9 --- Growth Stage (8 archetypes)**

Low trust deficit. These sellers have established products and some
market presence. Architecture shifts from trust-building to conversion
optimisation and retention. Press mentions, expert endorsement, and
comparison tools become primary instruments.

  -------- ---------------- ---------------- -------------- ---------- ------------------
  **ID**   **Archetype**    **Motivation**   **Trust        **COD      **Traffic**
                                             Deficit**      Likely**   

  55       Early D2C Brand  Establish brand  Moderate       No         Paid social
                            presence, prove                            
                            unit economics                             

  56       Bootstrapped     Scale            Low-Moderate   No         Paid social
           Scaling Brand    efficiently                                
                            without external                           
                            capital                                    

  57       Funded Startup   Achieve category Low            No         Paid social
                            leadership, hit                            
                            investor                                   
                            milestones                                 

  58       Mid-Size Brand   Optimise         Low            No         Paid social
           (â‚¹1--10Cr)       margins, retain                            
                            customers,                                 
                            expand category                            

  59       Omnichannel      Optimise D2C     Very Low       No         Paid social
           Brand            channel within                             
                            omnichannel                                
                            strategy                                   

  60       Category Creator Define and own a Moderate       No         Paid social
                            new category                               
                            before                                     
                            competitors                                

  61       Private Label    Build brand      Moderate       No         Paid social
           Brand            equity on top of                           
                            private label                              
                            foundation                                 

  62       Amazon /         Reduce           Low            No         Organic search
           Flipkart Power   marketplace fee                            
           Seller           dependence,                                
                            build owned                                
                            channel                                    
  -------- ---------------- ---------------- -------------- ---------- ------------------

**Cluster 10 --- Cause-Driven (5 archetypes)**

Moderate trust deficit. The cause narrative is the primary conversion
instrument --- why the seller exists is as important as what they sell.
Mission statement and maker story are always elevated. Urgency mechanics
are light or absent --- buyers who convert on cause alignment are
slower, more deliberate purchasers.

  -------- ---------------- ----------------- -------------- ---------- -----------------
  **ID**   **Archetype**    **Motivation**    **Trust        **COD      **Traffic**
                                              Deficit**      Likely**   

  63       Social           Sustainable       Moderate       No         Organic social
           Enterprise       commercial model                            
                            to fund social                              
                            mission                                     

  64       Women            Economic          Moderate       No         Organic social
           Empowerment      empowerment of                              
           Brand            women makers                                

  65       Environment /    Prove sustainable Low-Moderate   No         Organic social
           Sustainability   commerce is                                 
                            commercially                                
                            viable                                      

  66       Rural Livelihood Sustainable       High           Yes        Organic social
           Brand            income for rural                            
                            community                                   

  67       Disability       Dignified         Moderate       No         Organic social
           Inclusion Brand  livelihood for                              
                            persons with                                
                            disability                                  
  -------- ---------------- ----------------- -------------- ---------- -----------------

**Clusters 11 & 12 --- V1.1 Parked (11 archetypes)**

These archetypes are defined in the system and reserved for future
activation. They are not currently active in the onboarding scoring
flow. They will be activated as the platform expands into adjacent
seller types and markets.

  --------------- -------- --------------------------- -------------------------
  **Cluster**     **ID**   **Archetype**               **Status**

  New India       68       ONDC-Native Seller          V1.1 Parked
  Sellers                                              

  New India       69       Quick Commerce Native Brand V1.1 Parked
  Sellers                                              

  New India       70       Live Commerce Seller        V1.1 Parked
  Sellers                                              

  New India       71       Rural & Vernacular Seller   V1.1 Parked
  Sellers                                              

  New India       72       Aggregator / Curator        V1.1 Parked
  Sellers                                              

  New India       73       Farmer & FPO Seller         V1.1 Parked
  Sellers                                              

  New India       74       Diaspora Bridge Seller      V1.1 Parked
  Sellers                                              

  New India       75       Celebrity / Public Figure   V1.1 Parked
  Sellers                  Brand                       

  New India       76       Doctor / Medical            V1.1 Parked
  Sellers                  Professional Brand          

  Cause-Driven    77       Social Impact Aggregator    V1.1 Parked
  V1.1                                                 

  Digital First   78       Regional Language Content   V1.1 Parked
  V1.1                     Creator                     
  --------------- -------- --------------------------- -------------------------

**4. The Intelligence Layer**

The intelligence layer is the computation engine that runs between
onboarding completion and store rendering. It takes the seller\'s
onboarding answers and produces a fully resolved store configuration ---
every component decision, every zone order, every urgency mechanic,
every trust signal placement. The seller does not configure any of this.
The system computes it.

**4.1 The 10 Persuasion Sequence Clusters**

The intelligence layer maps every seller\'s archetype to one of 10
persuasion sequence clusters. The cluster determines how the PDP
persuasion sequence is structured for that seller type. The
primary_hesitation from Q6.3 then selects the specific row from
ob_persuasion_sequences. Together, archetype cluster + buyer hesitation
= the complete PDP configuration.

  ---------------------- ----------------------- ---------------- --------------- ---------------------------
  **Cluster**            **Character**           **Above-Fold     **Urgency       **Narrative Arc**
                                                 Lead**           Mechanic**      

  dropshipper            High urgency,           product_visual   stock_counter / desire_then_justify
                         trust-building first                     social_pulse    

  craft_maker            Story-first, no         maker_story      none            story_then_proof_then_buy
                         pressure                                                 

  knowledge_expert       Evidence-first,         clinical_proof   none            evidence_then_act
                         clinical                                                 

  digital_native         Social proof, momentum  product_visual   social_pulse    desire_then_justify

  trust_seeker           Trust signals maximal   product_visual / none            trust_first_then_convert
                                                 seller_face                      

  spiritual_wellness     Story and meaning first seller_face /    none            story_then_proof_then_buy
                                                 maker_story                      

  established_operator   Brand-led, light trust  product_visual   none            desire_then_justify

  growth_hustler         Conversion-aggressive   product_visual   timer /         desire_then_justify
                                                                  stock_counter   

  catalogue_trader       Price and value first   price_value /    none            desire_then_justify
                                                 product_visual                   

  cause_driven           Mission-first, then     maker_story      none            story_then_proof_then_buy
                         product                                                  
  ---------------------- ----------------------- ---------------- --------------- ---------------------------

**4.2 The 57 Persuasion Sequences**

Each persuasion sequence is a specific combination of primary_hesitation
Ã— archetype_cluster. The system has 57 named sequences in
ob_persuasion_sequences. For any seller, the system selects the matching
sequence and applies the full configuration: PDP zone order, above-fold
lead, above-fold secondary, urgency mechanic, CTA behaviour, COD badge
placement, social proof placement, and trust signal placement.

  ----------------------- ----------------------- ---------------- --------------- ---------------- ---------------------
  **Hesitation**          **Clusters Covered**    **Above-Fold     **Urgency**     **CTA            **COD Badge**
                                                  Lead**                           Behaviour**      

  Unknown Brand           craft_maker,            maker_story /    none /          standard /       near_cta /
  (unknown_brand)         spiritual_wellness,     seller_face /    social_pulse    dominant /       above_fold_near_cta
                          trust_seeker,           product_visual /                 with_cod_badge   
                          dropshipper,            clinical_proof                                    
                          digital_native,                                                           
                          knowledge_expert,                                                         
                          growth_hustler,                                                           
                          established_operator,                                                     
                          catalogue_trader,                                                         
                          cause_driven                                                              

  COD Available (cod)     dropshipper,            product_visual / stock_counter / with_cod_badge   above_fold_near_cta
                          digital_native,         seller_face /    social_pulse /                   (all)
                          craft_maker,            maker_story      none                             
                          trust_seeker,                                                             
                          spiritual_wellness,                                                       
                          cause_driven,                                                             
                          established_operator,                                                     
                          catalogue_trader                                                          

  Price Justification     dropshipper,            maker_story /    stock_counter / standard /       near_cta
  (price_justification)   craft_maker,            clinical_proof / timer /         with_offer /     
                          knowledge_expert,       product_visual / social_pulse /  dominant         
                          digital_native,         price_value      none                             
                          spiritual_wellness,                                                       
                          growth_hustler,                                                           
                          established_operator,                                                     
                          trust_seeker,                                                             
                          catalogue_trader,                                                         
                          cause_driven                                                              

  Quality (quality)       dropshipper,            product_visual / none            standard /       near_cta
                          craft_maker,            clinical_proof                   with_offer       
                          knowledge_expert,                                                         
                          trust_seeker                                                              

  No Reviews (no_reviews) craft_maker,            maker_story /    none /          standard /       near_cta / above_fold
                          trust_seeker,           product_visual   social_pulse    dominant         
                          digital_native                                                            

  Authenticity            craft_maker,            maker_story /    none            standard         near_cta
  (authenticity)          spiritual_wellness,     seller_face /                                     
                          trust_seeker            product_visual                                    

  Returns (returns)       dropshipper,            product_visual   none            standard /       near_cta / above_fold
                          craft_maker,                                             with_cod_badge   
                          trust_seeker,                                                             
                          growth_hustler                                                            
                          (fashion)                                                                 

  Size & Fit (size_fit)   growth_hustler,         product_visual   stock_counter / standard         near_cta
                          trust_seeker                             none                             

  Ingredients             knowledge_expert,       clinical_proof / none            standard         near_cta
  (ingredients)           spiritual_wellness      maker_story                                       

  Logistics (logistics)   dropshipper,            product_visual   none            with_cod_badge / above_fold_near_cta
                          trust_seeker                                             standard         

  Price Comparison        catalogue_trader,       price_value /    none / timer    with_offer       near_cta
  (price_comparison)      growth_hustler          product_visual                                    

  Decision Paralysis      catalogue_trader,       product_visual   none            standard         near_cta
  (decision_paralysis)    knowledge_expert                                                          

  Personalisation         knowledge_expert,       product_visual / none            standard         near_cta
  (personalisation)       spiritual_wellness      seller_face                                       

  Support (support)       dropshipper,            product_visual   none            with_cod_badge / above_fold_near_cta
                          trust_seeker                                             standard         

  Delivery Timing         trust_seeker (gifting)  product_visual   none            standard         near_cta
  (delivery_timing)                                                                                 
  ----------------------- ----------------------- ---------------- --------------- ---------------- ---------------------

**4.3 The 5 Above-Fold Lead Types**

The above-fold lead is the most important single decision in the first
impression architecture. It determines what the buyer sees first ---
before they scroll --- and sets the entire emotional register of the
page.

  ---------------- --------------------- ------------------------------------
  **Lead Type**    **Meaning**           **Who Gets It**

  product_visual   The product is the    Dropshippers, digital natives,
                   hero. Largest image   fashion sellers, most established
                   above fold. Gallery   brands. Traffic from paid ads or
                   Zone is the primary   marketplace redirect.
                   instrument.           

  maker_story      The person behind the Craft makers, artisans, cause-driven
                   product leads. Story  sellers, heritage sellers. Organic
                   section or founder    social traffic --- audience knows
                   image above fold      the maker.
                   before gallery.       

  seller_face      The practitioner\'s   Wellness practitioners, fitness
                   face and credentials  professionals, spiritual sellers.
                   lead. Expert          Audience came because of the person,
                   authority is the      not the product.
                   trust instrument.     

  clinical_proof   Data, certifications, Knowledge experts, clinical
                   and evidence lead.    skincare, Ayurvedic with scientific
                   Science is the trust  backing. Research-mode traffic from
                   instrument.           organic search.

  price_value      Price and offer       High price-comparison hesitation.
                   visibility lead.      Catalogue traders. Paid ads traffic
                   Value proposition is  where price is the hook.
                   the opening           
                   statement.            
  ---------------- --------------------- ------------------------------------

**4.3.1 Above-the-Fold Composition Rules (The Conversion Nucleus)**

The intersection of the Above-Fold Lead and the Primary Hesitation creates the **Conversion Nucleus**. The system strictly enforces the following composition rules above the fold based on the traffic source:
- *Organic Search / Direct:* Slower narrative arc. Focus on Brand Story and Authenticity before aggressive CTA injection.
- *Meta/Instagram Ads:* Impulse-driven. Immediate visual proof, social pulse, and early CTA placement.
- *Google Shopping:* Price comparison mode. Immediate emphasis on Trust Badges, Price Justify, and Return policies.

**4.4 The 97 Activation Rules**

The activation rules are the logic that determines which of the 110
components render for each store. There are 97 rules in
cr_activation_rules. Each rule takes an input from the seller profile,
applies a condition, and fires a result action: ACTIVATE, REQUIRE,
SUPPRESS, or WEIGHT_UP.

Example rules:

  --------- --------------- -------------------------- ---------------------- -----------------
  **Rule    **Component**   **Input**                  **Condition**          **Action**
  ID**                                                                        

  ACT_001   COD Available   customer_hesitation        CONTAINS cod_barrier   ACTIVATE
            Badge                                                             

  ACT_010   Before/After    product_category           IN Beauty & Personal   ACTIVATE
            Slider                                     Care, Health           

  ACT_020   Size Guide      product_category           IS Fashion & Wearables REQUIRE
            Modal                                                             

  ACT_106   Instagram / UGC seller_archetype.cluster   IS Digital First       ACTIVATE
            Feed                                                              

  ACT_110   Authenticity    customer_hesitation        CONTAINS               ACTIVATE
            Badge                                      authenticity_anxiety   

  ACT_112   Authenticity    seller_archetype           IN Traditional         REQUIRE
            Badge                                      Artisan, Heritage      
                                                       Food, Tribal Art       

  ACT_120   Certification   product_category           IS Food & Beverage     REQUIRE (FSSAI)
            Badge Block                                                       

  ACT_190   Mega Menu       commerce_architecture      IS Catalog-First       REQUIRE

  ACT_210   Partial Prepaid rto_score                  GT 54                  ACTIVATE
            Gate                                                              

  ACT_240   Category        commerce_architecture      IS Catalog-First       REQUIRE
            Navigation                                                        
            Tiles                                                             
  --------- --------------- -------------------------- ---------------------- -----------------

**4.5 The 63 Archetype Overrides**

Beyond the generic activation rules, 63 archetype-specific overrides
apply to certain sellers. These override the default behaviour of
specific components for specific archetypes --- activating, suppressing,
reordering, weight-adjusting, or seeding content differently based on
who the seller is.

  ------------ ---------------- --------------- ----------------------------- ---------------------
  **Override   **Archetype /    **Component**   **Action**                    **Why**
  ID**         Cluster**                                                      

  AO_001       Pure Dropshipper Real-time Sales REQUIRE                       Sales pulse is the
                                Pulse                                         core conversion
                                                                              mechanic for
                                                                              dropshipping

  AO_002       Pure Dropshipper Stock Scarcity  WEIGHT_UP: HIGH               Scarcity counter more
                                Counter                                       prominent --- urgency
                                                                              is the primary
                                                                              mechanic

  AO_005       Pure Dropshipper Emotional Story SUPPRESS                      No maker narrative
                                Block                                         credibility for
                                                                              dropshippers

  AO_008       Traditional      Authenticity    REQUIRE                       GI certification and
               Artisan          Badge                                         provenance
               (GI-Tagged)                                                    authenticity
                                                                              mandatory

  AO_009       Traditional      Emotional Story REQUIRE                       Maker story mandatory
               Artisan          Block                                         for artisan
               (GI-Tagged)                                                    credibility

  AO_010       Heritage & Craft Emotional Story WEIGHT_UP: HIGH               Maker story is
               (cluster)        Block                                         primary trust
                                                                              mechanism --- more
                                                                              prominent than usual

  AO_011       Heritage & Craft Urgency Timer   SUPPRESS                      Countdown timers
               (cluster)                                                      damage heritage and
                                                                              authentic perception

  AO_012       Heritage & Craft Real-time Sales SUPPRESS                      Sales pulse damages
               (cluster)        Pulse                                         artisanal scarcity
                                                                              narrative

  AO_014       Heritage & Craft Stock Scarcity  OVERRIDE copy                 Reframed:
               (cluster)        Counter                                       \"Handcrafted in
                                                                              small batches ---
                                                                              only \[X\]
                                                                              remaining\"

  AO_017       YouTube Creator  Video Embed     ACTIVATE                      Video asset expected
                                                                              --- creator has video
                                                                              content

  AO_021       Creator /        Instagram / UGC REQUIRE                       Influencer\'s own
               Influencer       Feed                                          content is the brand

  AO_022       Creator /        UGC / Social    REQUIRE                       UGC on PDP for
               Influencer       Feed Block                                    influencer-brand
                                                                              products

  AO_030       Established      Urgency Timer   SUPPRESS                      Countdown timers
               Brand                                                          below established
                                                                              brand standard

  AO_032       Established      Press / As Seen ACTIVATE                      Established brands
               Brand            In Strip                                      have press coverage

  AO_037       Meesho / Social  COD Available   REQUIRE                       Meesho buyers are
               Reseller         Badge                                         heavily COD --- badge
                                                                              mandatory

  AO_040       Spiritual /      Meaning /       REQUIRE                       Mandatory for
               Devotional       Benefits                                      spiritual products
               Seller           Section                                       

  AO_041       Spiritual /      Ritual Guide    REQUIRE                       Ritual guide
               Devotional                                                     mandatory
               Seller                                                         

  AO_043       Spiritual /      Urgency Timer   SUPPRESS                      Timer incompatible
               Devotional                                                     with spiritual
               Seller                                                         category trust

  AO_060       Family Business  Emotional Story SEED_FROM: legacy_story       Story seeded from
               2nd Gen          Block                                         generations,
                                                                              heritage, years in
                                                                              business

  AO_073       New Brand        Reviews Section EMPTY_STATE                   Incentivised: \"Be
               Builder          (empty)                                       the first to review
                                                                              --- get 10% off your
                                                                              next order\"

  AO_081       Marketplace      Brand Story     SEED_FROM:                    Why direct is better
               Seller Going D2C Section         marketplace_migration_story   for the buyer

  AO_090       Impulse Buyer    Product         COLLAPSE more aggressively    Impulse buyers don\'t
               Target           Description ---                               read long
                                Long                                          descriptions

  AO_092       Impulse Buyer    Stock Scarcity  REQUIRE                       Scarcity mandatory
               Target           Counter                                       for impulse
                                                                              archetypes

  AO_100       Research Buyer   Specs Table     REQUIRE                       Research buyers need
               Target                                                         full detail

  AO_102       Research Buyer   Product         EXPAND (not collapsed)        Research buyers want
               Target           Description ---                               full information
                                Long                                          

  AO_103       Research Buyer   Stock Scarcity  SUPPRESS                      Pressure tactics
               Target           Counter                                       damage trust with
                                                                              research buyers
  ------------ ---------------- --------------- ----------------------------- ---------------------

**4.6 The Full Page System (Beyond the PDP)**
The intelligence layer extends beyond the Product Detail Page to construct the entire unified storefront, especially the Homepage.
- **Homepage Construction:** Derived from `getDefaultHomepageSections()` based on the seller's commerce architecture.
  - *Product Engine* stores get a focused, high-conversion `product_hero_trust` initial block.
  - *Catalog-First* stores get a broader `catalog_browse` block.
- **Personalised Dummy Content:** Unlike standard platforms, Easy D2C never uses generic "Lorem Ipsum". During the initialisation phase, `content_seeds` and `CATEGORY_HERO_IMAGES` are used to populate the store with category-relevant high-quality copy and images, generating an immediate "Magic Moment" for the seller.

**5. The 110-Component Registry**

The platform has 110 named components across 9 pages, organised into 16
component groups. For each store, the intelligence layer computes which
components are active (from activation rules + archetype overrides +
category requirements). The mood card then governs how every active
component looks.

Governance levels: LOCKED --- cannot be overridden
(conversion-critical). GOVERNED --- intelligence layer controls, seller
can override with opinion. FLEXIBLE --- seller has full control.
SELLER_CHOICE --- seller decides, no system opinion.

**PDP Components --- Product Detail Page**

  -------------- ---------------- ------------- ------------- ------------- ---------------- -------------
  **ID**         **Component      **Group**     **Zone**      **Default**   **Governance**   **Mobile
                 Name**                                                                      Mandatory**

  COMP_PDP_001   Product Gallery  Gallery       Gallery Zone  ACTIVE        LOCKED           Yes
                 --- Main                                                                    

  COMP_PDP_002   Video Embed      Gallery       Gallery Zone  INACTIVE      GOVERNED         No

  COMP_PDP_003   Before/After     Gallery       Gallery Zone  INACTIVE      GOVERNED         No
                 Slider                                                                      

  COMP_PDP_004   360Â° Spin Viewer Gallery       Gallery Zone  INACTIVE      GOVERNED         No

  COMP_PDP_010   Product Title    Conversion    Conversion    ACTIVE        LOCKED           Yes
                                  Core          Zone                                         

  COMP_PDP_011   Reviews Summary  Conversion    Conversion    ACTIVE        LOCKED           Yes
                 Bar              Core          Zone                                         

  COMP_PDP_012   Price Display    Offer Cluster Conversion    ACTIVE        LOCKED           Yes
                                                Zone                                         

  COMP_PDP_013   Variant Selector Offer Cluster Conversion    ACTIVE        LOCKED           Yes
                                                Zone                                         

  COMP_PDP_014   Quantity         Offer Cluster Conversion    ACTIVE        LOCKED           Yes
                 Selector                       Zone                                         

  COMP_PDP_015   Add to Cart /    CTA Block     Conversion    ACTIVE        LOCKED           Yes
                 Buy Now CTA                    Zone                                         

  COMP_PDP_016   Sticky CTA ---   CTA Block     Sticky Layer  ACTIVE        LOCKED           Yes
                 Mobile                                                                      

  COMP_PDP_017   Estimated        Offer Cluster Conversion    ACTIVE        GOVERNED         No
                 Delivery Date                  Zone                                         

  COMP_PDP_018   COD Available    Trust Visual  Conversion    INACTIVE      GOVERNED         No
                 Badge                          Zone                                         

  COMP_PDP_019   Highlights Strip Conversion    Conversion    ACTIVE        GOVERNED         No
                                  Core          Zone                                         

  COMP_PDP_020   Size Guide Modal Conversion    Conversion    INACTIVE      GOVERNED         No
                                  Core          Zone                                         

  COMP_PDP_021   Trust Visual     Trust         Conversion    ACTIVE        LOCKED           No
                 Block                          Zone                                         

  COMP_PDP_022   Trust Bar ---    Trust         Conversion    ACTIVE        GOVERNED         No
                 Full Width                     Zone                                         

  COMP_PDP_023   Authenticity     Trust         Conversion    INACTIVE      GOVERNED         No
                 Badge                          Zone                                         

  COMP_PDP_024   Certification    Trust         Conversion    INACTIVE      GOVERNED         No
                 Badge Block                    Zone                                         

  COMP_PDP_025   Return Policy    Trust         Conversion    INACTIVE      GOVERNED         No
                 Highlight                      Zone                                         

  COMP_PDP_026   Secure Payment   Trust         Conversion    ACTIVE        GOVERNED         No
                 Icons                          Zone                                         

  COMP_PDP_030   Product          Description   Description   ACTIVE        GOVERNED         No
                 Description ---                Zone                                         
                 Long                                                                        

  COMP_PDP_031   Ingredient Block Description   Description   INACTIVE      GOVERNED         No
                                                Zone                                         

  COMP_PDP_032   How To Use       Description   Description   INACTIVE      GOVERNED         No
                 Section                        Zone                                         

  COMP_PDP_033   Specs Table      Description   Description   INACTIVE      GOVERNED         No
                                                Zone                                         

  COMP_PDP_034   Nutritional      Description   Description   INACTIVE      GOVERNED         No
                 Table                          Zone                                         

  COMP_PDP_035   Fabric /         Description   Description   INACTIVE      GOVERNED         No
                 Material Details               Zone                                         

  COMP_PDP_036   Storage / Shelf  Description   Description   INACTIVE      GOVERNED         No
                 Life Block                     Zone                                         

  COMP_PDP_037   Dosage           Description   Description   INACTIVE      GOVERNED         No
                 Instructions                   Zone                                         

  COMP_PDP_038   Dimension / Size Description   Description   INACTIVE      GOVERNED         No
                 Visual                         Zone                                         

  COMP_PDP_039   Meaning /        Description   Description   INACTIVE      GOVERNED         No
                 Benefits Section               Zone                                         

  COMP_PDP_040   Ritual Guide     Description   Description   INACTIVE      GOVERNED         No
                                                Zone                                         

  COMP_PDP_041   Emotional Story  Description   Description   INACTIVE      GOVERNED         No
                 Block                          Zone                                         

  COMP_PDP_042   Installation     Description   Description   INACTIVE      GOVERNED         No
                 Guide                          Zone                                         

  COMP_PDP_043   EMI / Financing  Description   Conversion    INACTIVE      GOVERNED         No
                 Block                          Zone                                         

  COMP_PDP_044   Warranty Badge   Trust         Description   INACTIVE      GOVERNED         No
                                                Zone                                         

  COMP_PDP_045   Subscription     Offer Cluster Conversion    INACTIVE      GOVERNED         No
                 Option                         Zone                                         

  COMP_PDP_050   Reviews Section  Social Proof  Social Proof  ACTIVE        GOVERNED         No
                 --- Full                       Zone                                         

  COMP_PDP_051   Photo Reviews    Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Grid                           Zone                                         

  COMP_PDP_052   UGC / Social     Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Feed Block                     Zone                                         

  COMP_PDP_053   Real-time Sales  Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Pulse                          Zone                                         

  COMP_PDP_054   Stock Scarcity   Social Proof  Conversion    INACTIVE      GOVERNED         No
                 Counter                        Zone                                         

  COMP_PDP_055   Urgency Timer    Social Proof  Conversion    INACTIVE      GOVERNED         No
                                                Zone                                         

  COMP_PDP_056   Testimonial      Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Quotes                         Zone                                         

  COMP_PDP_057   Expert /         Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Authority Quote                Zone                                         

  COMP_PDP_058   Comparison       Social Proof  Social Proof  INACTIVE      GOVERNED         No
                 Toggle                         Zone                                         

  COMP_PDP_059   Feature Icon     Social Proof  Description   INACTIVE      GOVERNED         No
                 Grid                           Zone                                         

  COMP_PDP_060   Frequently       Cross-Sell    Cross-Sell    INACTIVE      GOVERNED         No
                 Bought Together                Zone                                         

  COMP_PDP_061   You May Also     Cross-Sell    Cross-Sell    INACTIVE      GOVERNED         No
                 Like                           Zone                                         

  COMP_PDP_062   Recently Viewed  Cross-Sell    Cross-Sell    INACTIVE      GOVERNED         No
                                                Zone                                         
  -------------- ---------------- ------------- ------------- ------------- ---------------- -------------

**Homepage, Collection, Cart, Checkout, Global & Other Components**

  --------------- ---------------- ------------ ---------- ------------- ----------------
  **ID**          **Component      **Page**     **Zone**   **Default**   **Governance**
                  Name**                                                 

  COMP_HP_001     Hero Banner ---  Homepage     Hero Zone  ACTIVE        SELLER_CHOICE
                  Full Width                                             

  COMP_HP_002     Hero --- Split   Homepage     Hero Zone  INACTIVE      SELLER_CHOICE
                  Layout                                                 

  COMP_HP_003     Hero --- Story   Homepage     Hero Zone  INACTIVE      SELLER_CHOICE
                  Video                                                  

  COMP_HP_004     Featured         Homepage     Products   ACTIVE        GOVERNED
                  Products Strip                Zone                     

  COMP_HP_005     Category         Homepage     Nav Zone   INACTIVE      GOVERNED
                  Navigation Tiles                                       

  COMP_HP_006     Brand Story      Homepage     Story Zone ACTIVE        GOVERNED
                  Section                                                

  COMP_HP_007     Testimonials     Homepage     Proof Zone ACTIVE        GOVERNED
                  Strip                                                  

  COMP_HP_008     Instagram / UGC  Homepage     Proof Zone INACTIVE      GOVERNED
                  Feed                                                   

  COMP_HP_009     Trust Bar ---    Homepage     Trust Zone ACTIVE        GOVERNED
                  Homepage                                               

  COMP_HP_010     Announcement Bar Homepage     Above Hero ACTIVE        FLEXIBLE

  COMP_HP_011     Collection       Homepage     Nav Zone   INACTIVE      GOVERNED
                  Banners Grid                                           

  COMP_HP_012     Newsletter /     Homepage     Footer     INACTIVE      FLEXIBLE
                  WhatsApp Optin                Zone                     

  COMP_HP_013     Press / As Seen  Homepage     Proof Zone INACTIVE      GOVERNED
                  In Strip                                               

  COMP_HP_014     Certifications   Homepage     Trust Zone INACTIVE      GOVERNED
                  Block                                                  

  COMP_COL_001    Collection       Collection   Above Grid ACTIVE        GOVERNED
                  Header Banner                                          

  COMP_COL_002    Product Grid --- Collection   Main Grid  ACTIVE        LOCKED
                  Standard                                               

  COMP_COL_003    Filter Panel --- Collection   Sidebar    ACTIVE        GOVERNED
                  Sidebar                                                

  COMP_COL_004    Filter Bar ---   Collection   Above Grid ACTIVE        GOVERNED
                  Top                                                    

  COMP_COL_005    Sort Dropdown    Collection   Above Grid ACTIVE        GOVERNED

  COMP_COL_006    Product Count    Collection   Above Grid ACTIVE        FLEXIBLE
                  Label                                                  

  COMP_COL_007    Quick View Modal Collection   Main Grid  INACTIVE      FLEXIBLE

  COMP_COL_008    Collection Story Collection   Above Grid INACTIVE      GOVERNED
                  Block                                                  

  COMP_COL_009    Empty State      Collection   Main Grid  ACTIVE        LOCKED
                  Block                                                  

  COMP_COL_010    Pagination /     Collection   Below Grid ACTIVE        GOVERNED
                  Infinite Scroll                                        

  COMP_CART_001   Cart Item List   Cart         Main       ACTIVE        LOCKED

  COMP_CART_002   Order Summary    Cart         Summary    ACTIVE        LOCKED
                  Panel                                                  

  COMP_CART_003   Checkout CTA --- Cart         Summary    ACTIVE        LOCKED
                  Cart                                                   

  COMP_CART_004   Free Shipping    Cart         Above      ACTIVE        GOVERNED
                  Progress Bar                  Items                    

  COMP_CART_005   Trust Signals    Cart         Below CTA  ACTIVE        GOVERNED
                  --- Cart                                               

  COMP_CART_006   You May Also     Cart         Below      INACTIVE      GOVERNED
                  Like --- Cart                 Items                    

  COMP_CART_007   COD Fee Notice   Cart         Summary    INACTIVE      GOVERNED

  COMP_CART_008   Coupon / Promo   Cart         Summary    INACTIVE      FLEXIBLE
                  Code Field                                             

  COMP_CART_009   Partial Prepaid  Checkout     Payment    INACTIVE      GOVERNED (RTO
                  Gate                                                   Engine)

  COMP_CART_010   Prepaid          Checkout     Payment    INACTIVE      GOVERNED (RTO
                  Incentive Banner                                       Engine)

  COMP_CART_011   Address Form     Checkout     Main       ACTIVE        LOCKED

  COMP_CART_012   Payment Method   Checkout     Main       ACTIVE        LOCKED
                  Selector                                               

  COMP_CART_013   Order            Checkout     Main       ACTIVE        LOCKED
                  Confirmation                                           
                  Page                                                   

  COMP_GLB_001    Navigation Bar   All Pages    Top        ACTIVE        LOCKED

  COMP_GLB_002    Mega Menu        All Pages    Top        INACTIVE      GOVERNED

  COMP_GLB_003    Footer ---       All Pages    Bottom     ACTIVE        LOCKED
                  Standard                                               

  COMP_GLB_004    WhatsApp Float   All Pages    Float      ACTIVE        GOVERNED
                  Button                                                 

  COMP_GLB_005    Cookie / Privacy All Pages    Float      INACTIVE      GOVERNED
                  Banner                                                 

  COMP_GLB_006    Smart Prompt --- All Pages    Float      INACTIVE      GOVERNED
                  Free Shipping                                          

  COMP_GLB_007    Smart Prompt --- All Pages    Float      INACTIVE      GOVERNED
                  Scarcity                                               

  COMP_GLB_008    Smart Prompt --- All Pages    Float      INACTIVE      GOVERNED
                  Support                                                

  COMP_ABT_001    Founder / Maker  About        Main       ACTIVE        GOVERNED
                  Story                                                  

  COMP_ABT_002    Mission          About        Main       ACTIVE        GOVERNED
                  Statement                                              

  COMP_ABT_003    Process / Craft  About        Main       INACTIVE      GOVERNED
                  Section                                                

  COMP_ABT_004    Team / People    About        Main       INACTIVE      GOVERNED
                  Section                                                

  COMP_ABT_005    Certifications & About        Main       INACTIVE      GOVERNED
                  Awards                                                 

  COMP_ABT_006    Contact CTA      About        Footer     ACTIVE        FLEXIBLE
                  Block                                                  

  COMP_POL_001    Return & Refund  Policies     Main       ACTIVE        LOCKED
                  Policy                                                 

  COMP_POL_002    Shipping Policy  Policies     Main       ACTIVE        LOCKED

  COMP_POL_003    Privacy Policy   Policies     Main       ACTIVE        LOCKED

  COMP_POL_004    Terms of Service Policies     Main       ACTIVE        LOCKED

  COMP_POL_005    Trust Callout    Policies     Header     ACTIVE        GOVERNED
                  --- Policy Page                                        

  COMP_SRC_001    Search Results   Search       Main       ACTIVE        LOCKED
                  Grid                                                   

  COMP_SRC_002    Search           Search       Input      ACTIVE        GOVERNED
                  Suggestions                                            

  COMP_SRC_003    No Results State Search       Main       ACTIVE        LOCKED

  COMP_SRC_004    Search Filters   Search       Sidebar    INACTIVE      GOVERNED
  --------------- ---------------- ------------ ---------- ------------- ----------------

**6. The Seller Override Layer**

Once the intelligence layer has computed the store configuration, the
seller has the ability to customise on top of it. This customisation is
the override layer --- a separate table (re_seller_overrides) that sits
above the intelligence layer\'s output and is never overwritten by
system recomputes.

**6.1 The Four Override Types**

  ---------- --------------------- ----------------- -----------------------
  **Type**   **What It Does**      **System          **Zone Rules**
                                   Opinion**         

  ACTIVATE   Seller turns on a     AGREES / CAUTION  Must activate within
             component the         / ADVISES_AGAINST its designated zone
             intelligence layer    based on context  
             had not activated.                      
             Component added to                      
             resolved active list.                   

  SUPPRESS   Seller turns off a    CAUTION or        LOCKED and
             component the         ADVISES_AGAINST   mobile_mandatory
             intelligence layer    --- always some   components cannot be
             had activated.        opinion           suppressed
             Component removed                       
             from resolved active                    
             list.                                   

  REORDER    Seller moves a        Always CAUTION    Zone boundaries cannot
             component to a        --- system always be crossed. Cannot move
             different position    flags reorders    from Conversion Zone to
             within its zone.                        Social Proof Zone.

  RESET      Seller resets a       No opinion        Full override history
             component to system   required --- this preserved in table.
             default. All prior    returns to system Component shows \"Using
             overrides for that                      system default.\"
             component                               
             deactivated.                            
  ---------- --------------------- ----------------- -----------------------

**6.2 The System Opinion**

Every ACTIVATE, SUPPRESS, or REORDER action generates a system opinion
at the moment of the action. The opinion is computed by
fn_get_override_opinion() and stored permanently. It never changes after
the fact. It is the system\'s honest assessment at the moment the seller
made the decision --- not a retrospective judgement.

  ----------------- ------------ -------------------------------------------------
  **Opinion**       **Can        **Admin UI Behaviour**
                    Proceed?**   

  AGREES            Yes          Green tick + reason. Confirm button prominent. No
                                 friction.

  CAUTION           Yes          Amber flag + reason. Confirm button present with
                                 \"I understand, proceed\" label. Seller can
                                 always proceed.

  ADVISES_AGAINST   Yes          Red flag + reason. Confirm button present with
                                 \"Override recommendation\" label. Seller can
                                 always proceed --- this is advice, not a block.

  BLOCKED           No           No override controls rendered. Component shows
                                 lock icon: \"This component is structurally
                                 locked.\" No button shown.
  ----------------- ------------ -------------------------------------------------

**6.3 The 25 LOCKED Components**

LOCKED components cannot be overridden under any circumstances. The
admin UI must never render override controls for these components. A
database trigger blocks any INSERT to re_seller_overrides that targets a
LOCKED component.

The 25 LOCKED components: Navigation Bar, Footer --- Standard, Product
Gallery --- Main, Product Title, Reviews Summary Bar, Price Display,
Variant Selector, Quantity Selector, Add to Cart / Buy Now CTA, Sticky
CTA --- Mobile, Trust Visual Block, Cart Item List, Order Summary Panel,
Checkout CTA --- Cart, Address Form, Payment Method Selector, Order
Confirmation Page, Product Grid --- Standard, Empty State Block, Search
Results Grid, No Results State, Return & Refund Policy, Shipping Policy,
Privacy Policy, Terms of Service.

**6.4 Override Persistence**

The override layer is completely independent of the intelligence layer.
When the intelligence layer recomputes (triggered by seller profile
updates), re_seller_overrides is never touched. A seller who manually
activated Quantity Breaks keeps it regardless of what the system
recomputes. A seller who suppressed the urgency timer keeps it
suppressed. The two layers are permanently separate.

**6.5 Locked Component UI & Graceful Degradation**

The system strictly enforces conversion architecture by locking high-leverage 
components. To maintain positive seller UX, the dashboard builder follows two 
strict patterns:

1. **The Locked Pattern:** Any component with a `LOCKED` state in the registry 
   cannot be suppressed or reordered. In the builder UI:
   - The "Delete" or "Hide" controls are removed.
   - A lock icon is displayed with a tooltip explaining the conversion logic: 
     *"This component is locked by the Conversion Engine to ensure your store 
     meets industry-standard trust requirements."*

2. **Graceful Degradation:** A locked component must never render as a void. 
   If a mandatory component (e.g., Reviews) has no data:
   - On the **Storefront**, it hides itself gracefully or renders a subtle 
     invitation ("Be the first to review").
   - In the **Dashboard Builder**, it remains visible but displays a 
     "Missing Data" warning with a setup link.

**7. Whitespace, Density & Image Quality (Compensatory Rendering)**

The system employs intelligent Compensatory Rendering. Because the intelligence layer knows the *seller archetype* and *image quality tier*, it dynamically adjusts whitespace and rendering styles to compensate for poor assets and optimize for high-quality assets.

**7.1 Whitespace & Content Density**
Whitespace is controlled via root tokens (`--section-gap`, `--component-gap`) which scale proportionally based on the `density_scale` seller modifier:
- *High Density (0.8x):* For Catalogue Traders, Dropshippers. Minimal gap to maximize product visibility per scroll.
- *Standard Density (1.0x):* Balanced for operators. 
- *Low Density (1.5x):* High whitespace for Premium/Luxury, Art, and Spiritual to let the product "breathe."

**7.2 Image Quality Handling**
During onboarding or image upload, assets are structurally classified into Tiers:
- **Tier 1 (Pro):** Clean background, high resolution, professional lighting. System renders edge-to-edge, low shadow, high corner radius.
- **Tier 2 (Acceptable):** OK lighting, minor clutter. System applies standard framing and card borders.
- **Tier 3 (Poor):** Bad lighting, cluttered background, low resolution. 
  The system applies **Dynamic Product Framing**. Instead of 
  full-bleed rendering, the image is scaled and centered within a 
  pristine, Mood-Card-colored CSS container with a subtle inner 
  shadow. Poor photos appear as intentional "composed" assets. If 
  unusable, a high-quality abstract gradient mesh generated from 
  the brand palette is used as a fallback. No AI generation is 
  deployed for images.
- *Admin Prompt:* Sellers uploading Tier 3 assets are prompted with a built-in "How to shoot on your phone" guide.

**8. The 10 Mood Cards**

The mood card is the complete visual language of the store. It is not a
colour palette or a theme --- it is a universal translator. Every
component that enters the page, from any source, is expressed in the
mood card\'s visual language. The 50+ design tokens are injected as CSS
custom properties at the store root. No component ever reads hardcoded
values --- every visual decision flows through the token system.

The mood card is chosen by the seller at onboarding (Q4.2) via a visual
card selection. It can be changed at any time. Changing the mood card
changes the entire visual expression of the store without touching a
single component.

**1 --- Saaf Suthra Â· Clean / Trustworthy**

English translation: Clean and trustworthy. Nothing trying too hard.
Every element earns its place. The store equivalent of a spotless
uniform.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           system-ui --- system-native, no web font load,
                         fastest possible

  Body Font              system-ui

  Primary Colour         #1B3A6B --- deep navy

  Background             #FFFFFF --- pure white

  CTA Colour             #1B3A6B --- navy

  Button Radius          6px --- slightly rounded, functional

  Card Radius            10px

  Motion Profile         minimal --- 180ms enter, scale-tap 0.98

  PDP Image Ratio        1:1 --- clean and square

  Micro-Interactions     opacity_hover: 0.8, scale_hover: 1.02, shadow_active: subtle
  Iconography            icon_weight: 400, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: ring

  Content Tone           functional --- direct, no-nonsense

  Best For Archetypes    dropshipper, catalogue_trader,
                         established_operator

  Best For Categories    Electronics & Tech, Health & Wellness, Kids &
                         Baby

  Indian Brand Reference Meesho --- accessible, trustworthy, no-nonsense

  Global Reference       Himalaya, Dettol, Parle

  Buyer Feel             This looks reliable. I know exactly what I\'m
                         getting.
  ---------------------- ------------------------------------------------

**2 --- Dhamaka Â· Bold / Unstoppable**

English translation: Bold and unstoppable. High energy, total
confidence. The store that makes you feel like you\'re shopping with the
cool crowd. Maximum motion, maximum presence.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Anton --- condensed display, all caps attitude

  Body Font              system-ui

  Primary Colour         #DC2626 --- bold red

  Background             #FFFFFF --- white for maximum contrast

  CTA Colour             #DC2626

  Button Radius          2px --- nearly sharp, aggressive

  Card Radius            6px

  Motion Profile         expressive --- 120ms enter (fastest), scale-tap
                         0.95 (most dramatic)

  PDP Image Ratio        4:5 --- portrait, editorial

  Micro-Interactions     opacity_hover: 0.9, scale_hover: 1.05, shadow_active: strong
  Iconography            icon_weight: 700, icon_style: solid
  Interface Details      border_width_input: 2px, border_width_card: 2px, focus: square

  Content Tone           bold --- punchy, decisive, no qualifiers

  Dark Mode Available    Yes

  Best For Archetypes    digital_native, growth_hustler, catalogue_trader

  Best For Categories    Fashion & Wearables, Electronics, Sports &
                         Fitness

  Indian Brand Reference boAt --- loud, dominant, energetic

  Global Reference       Gymshark

  Buyer Feel             This brand has attitude. I want to be associated
                         with this.
  ---------------------- ------------------------------------------------

**3 --- Dil Se Desi Â· Warm / Handcrafted**

English translation: From the heart, Indian. Earthy warm tones. The
craft and the maker are as present as the product. Human hands are
visible. Nothing is too polished.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Playfair Display --- literary serif, warm and
                         dignified

  Body Font              system-ui

  Primary Colour         #92400E --- warm brown

  Background             #FDFAF6 --- warm white, never cold

  CTA Colour             #92400E

  Button Radius          9999px --- fully rounded, gentle and
                         approachable

  Card Radius            14px

  Motion Profile         moderate --- 240ms enter, scale-tap 0.98

  PDP Image Ratio        4:5 --- portrait, lifestyle

  Micro-Interactions     opacity_hover: 0.7, scale_hover: 1.03, shadow_active: soft
  Iconography            icon_weight: 300, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: subtle

  Content Tone           warm --- storytelling, human, unhurried

  Best For Archetypes    craft_maker, spiritual_wellness, cause_driven

  Best For Categories    Jewellery, Home & Living, Spiritual &
                         Devotional, Food & Beverage

  Indian Brand Reference Fabindia --- warm, handcrafted, story-driven

  Global Reference       Jaypore, iTokri, Good Earth, Etsy\'s best
                         sellers

  Buyer Feel             Someone made this with love. There\'s a real
                         person behind this.
  ---------------------- ------------------------------------------------

**4 --- Shaahi Â· Premium / Refined**

English translation: Royal. Maximum restraint. Silence is the luxury
signal. Nothing shouts. The brand that has nothing to prove. The slowest
motion in the system, the most generous whitespace.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Playfair Display --- elegant, refined, never
                         aggressive

  Body Font              system-ui

  Primary Colour         #1C1917 --- near black

  Background             #FAFAF9 --- off-white, warm and quiet

  CTA Colour             #1C1917

  Button Radius          0px --- perfectly square, uncompromising

  Card Radius            0px --- sharp, architectural

  Motion Profile         minimal --- 300ms enter (slowest), scale-tap
                         0.99 (most subtle)

  PDP Image Ratio        3:4 --- tall portrait, editorial luxury

  Micro-Interactions     opacity_hover: 0.95, scale_hover: 1.01, shadow_active: none
  Iconography            icon_weight: 200, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 0px, focus: underline

  Content Tone           premium --- understatement, implication, never
                         hype

  Best For Archetypes    established_operator, knowledge_expert,
                         craft_maker

  Best For Categories    Jewellery, Beauty & Personal Care, Home &
                         Living, Gifting

  Indian Brand Reference Forest Essentials --- elevated, refined, quiet
                         luxury

  Global Reference       Tanishq, Aesop

  Buyer Feel             This is special. For people who appreciate
                         quality.

  Nav Special Treatment  Text-based \"BAG\" not cart icon. Full-screen
                         overlay mobile menu at 600ms.
  ---------------------- ------------------------------------------------

**5 --- Taza Aur Mast Â· Fresh / Social-Native**

English translation: Fresh and happy. Social-media native. Fast,
playful, the grid is alive. Purple-dominant. The fastest motion in the
system. UGC-heavy. Community-led.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Anton --- display, uppercase, fast

  Body Font              system-ui

  Primary Colour         #7C3AED --- bold purple

  Background             #FFFFFF

  CTA Colour             #7C3AED

  Button Radius          9999px --- pill, playful and social

  Card Radius            18px --- generously rounded

  Motion Profile         expressive --- 150ms enter, scale-tap 0.95

  PDP Image Ratio        1:1 --- square, social-native format

  Micro-Interactions     opacity_hover: 0.85, scale_hover: 1.08, shadow_active: bouncy
  Iconography            icon_weight: 600, icon_style: solid
  Interface Details      border_width_input: 1.5px, border_width_card: 1.5px, focus: bubble

  Content Tone           bold --- casual, direct, community voice

  Best For Archetypes    digital_native, growth_hustler, trust_seeker

  Best For Categories    Beauty & Personal Care, Food & Beverage, Kids &
                         Baby, Stationery

  Indian Brand Reference Sugar Cosmetics / Mamaearth --- relatable,
                         shareable, community-first

  Global Reference       Glossier

  Buyer Feel             My friends would love this. I want to share
                         this.
  ---------------------- ------------------------------------------------

**6 --- Swasth Aur Sachcha Â· Natural / Conscious**

English translation: Healthy and honest. Clean and botanical. Science
and nature in equal measure. Green-dominant. Ingredient-forward.
Certification-heavy. No artifice.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Playfair Display --- organic, literary

  Body Font              system-ui

  Primary Colour         #166534 --- deep botanical green

  Background             #F7FAF7 --- barely-green white

  CTA Colour             #166534

  Button Radius          9999px --- rounded, approachable

  Card Radius            14px

  Motion Profile         minimal --- 200ms enter, scale-tap 0.98

  PDP Image Ratio        4:5 --- portrait, lifestyle natural

  Micro-Interactions     opacity_hover: 0.75, scale_hover: 1.02, shadow_active: minimal
  Iconography            icon_weight: 400, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: glow

  Content Tone           warm --- transparent, ingredient-honest, quietly
                         confident

  Best For Archetypes    craft_maker, knowledge_expert, cause_driven

  Best For Categories    Beauty & Personal Care, Health & Wellness, Food
                         & Beverage, Plants

  Indian Brand Reference Organic India --- natural, honest, earth-toned

  Global Reference       The Moms Co, The Ordinary

  Buyer Feel             I can trust what\'s in this. Made responsibly.
  ---------------------- ------------------------------------------------

**7 --- Gyaan Aur Bharosa Â· Expert / Clinical**

English translation: Knowledge and trust. Clinical precision. Data is
the hero. Trust through evidence. Navy-dominant, white background,
precise. The most data-forward card in the system.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           system-ui --- clinical precision, no decorative
                         fonts

  Body Font              system-ui

  Primary Colour         #1E3A5F --- deep clinical navy

  Background             #FFFFFF --- clinical white

  CTA Colour             #1E3A5F

  Button Radius          6px --- functional

  Card Radius            10px

  Motion Profile         minimal --- 160ms enter, scale-tap 0.98

  PDP Image Ratio        1:1 --- clinical, precise

  Micro-Interactions     opacity_hover: 0.8, scale_hover: 1.01, shadow_active: flat
  Iconography            icon_weight: 500, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: ring

  Content Tone           clinical --- factual, evidence-driven, never
                         emotional

  Best For Archetypes    knowledge_expert, established_operator

  Best For Categories    Health & Wellness, Beauty & Personal Care, Kids
                         & Baby, Electronics

  Indian Brand Reference Dr. Vaidya\'s / 1mg --- clinical, authoritative,
                         factual

  Global Reference       Minimalist, Wirecutter

  Buyer Feel             These people know what they\'re doing.
  ---------------------- ------------------------------------------------

**8 --- Rooh Aur Riwaz Â· Spiritual / Sacred**

English translation: Soul and tradition. Meditative. Sacred. Everything
placed with intention. Deep burgundy and saffron cream. Gold accent
thread. Second-slowest motion in the system after Shaahi. The Rooh nav
uses text \"CART\" not an icon --- same as Shaahi.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Playfair Display --- sacred, dignified,
                         intentional

  Body Font              system-ui

  Primary Colour         #7C2D12 --- deep burgundy

  Background             #FDFAF6 --- warm saffron cream

  CTA Colour             #7C2D12

  Button Radius          9999px --- rounded, ceremonial

  Card Radius            20px --- the most rounded card in the system

  Motion Profile         minimal --- 280ms enter, scale-tap 0.99 (near
                         Shaahi)

  PDP Image Ratio        4:5 --- portrait, reverent

  Micro-Interactions     opacity_hover: 0.85, scale_hover: 1.02, shadow_active: deep
  Iconography            icon_weight: 200, icon_style: outline
  Interface Details      border_width_input: 0.5px, border_width_card: 0.5px, focus: dot

  Content Tone           sacred --- meaning-first, unhurried, never
                         commercial

  Best For Archetypes    spiritual_wellness, craft_maker

  Best For Categories    Spiritual & Devotional, Jewellery, Home & Living

  Indian Brand Reference Zandu / Patanjali --- sacred, ritual, heritage

  Global Reference       Premium pooja store meets modern wellness brand

  Buyer Feel             This comes from genuine belief. I can feel the
                         energy.

  Nav Special Treatment  Text \"CART (0)\" not icon. Full-screen overlay
                         mobile menu at 600ms. Gold dot separators
                         between nav links.
  ---------------------- ------------------------------------------------

**9 --- Rasoi Aur Pyaar Â· Food / Sensorial**

English translation: Kitchen and love. Appetite-first. Warm. Rich
close-up food photography. Textures, colours, steam. The only mood card
with a cursive display font --- Dancing Script --- which gives the store
a handwritten, home-kitchen warmth.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           Dancing Script --- the only cursive font in the
                         system. Warm, personal, home-kitchen.

  Body Font              system-ui

  Primary Colour         #7F1D1D --- deep warm red

  Background             #FFFBF7 --- warm cream, appetite-inducing

  CTA Colour             #7F1D1D

  Button Radius          9999px --- rounded, warm

  Card Radius            18px

  Motion Profile         moderate --- 220ms enter, scale-tap 0.97

  PDP Image Ratio        4:5 --- portrait, food photography

  Micro-Interactions     opacity_hover: 0.8, scale_hover: 1.04, shadow_active: warm
  Iconography            icon_weight: 400, icon_style: outline
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: ring

  Content Tone           sensorial --- appetite-first, evocative,
                         ingredient-proud

  Best For Archetypes    craft_maker, digital_native, knowledge_expert

  Best For Categories    Food & Beverage, Gifting & Occasions, Home &
                         Living

  Indian Brand Reference iD Fresh Food --- warm, sensorial, home-kitchen

  Global Reference       Premium home chef brand, Ottolenghi

  Buyer Feel             I can almost taste this. Made with real love.
  ---------------------- ------------------------------------------------

**10 --- Tech Aur Takneek Â· Technical / Spec-Forward**

English translation: Technology and technique. Dark canvas. Product
glow. Cold, precise, unmistakably technical. The only dark-background
card that is dark by default (not a dark mode option). Cyan primary on
dark --- the most distinct visual identity in the system.

  ---------------------- ------------------------------------------------
  **Token**              **Value**

  Heading Font           system-ui --- mono/technical feel without a
                         custom font

  Body Font              system-ui

  Primary Colour         #38BDF8 --- electric cyan

  Background             #0F172A --- near-black dark slate

  CTA Colour             #38BDF8

  Button Radius          6px --- precise, engineered

  Card Radius            10px

  Motion Profile         minimal --- 140ms enter (second fastest),
                         scale-tap 0.97

  PDP Image Ratio        1:1 --- square, spec-photography

  Micro-Interactions     opacity_hover: 0.9, scale_hover: 1.06, shadow_active: glow
  Iconography            icon_weight: 300, icon_style: solid
  Interface Details      border_width_input: 1px, border_width_card: 1px, focus: cyan-ring

  Content Tone           functional --- spec-first, performance-focused,
                         no sentiment

  Dark Mode Available    Yes (the page is already dark --- dark mode is
                         the default)

  Best For Archetypes    knowledge_expert, established_operator,
                         catalogue_trader

  Best For Categories    Electronics & Tech Accessories, Automotive &
                         Industrial, Sports & Fitness

  Indian Brand Reference Noise / Realme --- technical, spec-forward, dark
                         mode friendly

  Global Reference       Nothing Technology, boAt\'s technical side

  Buyer Feel             These people know their product inside out.
  ---------------------- ------------------------------------------------

**Mood Card Quick Reference**

  ---------- ------------- ---------------- ----------- ---------- ------------ --------- ------------
  **Mood     **Primary**   **Background**   **Heading   **Button   **Motion**   **PDP     **Content
  Card**                                    Font**      Radius**                Ratio**   Tone**

  Saaf       #1B3A6B Navy  #FFFFFF White    system-ui   6px        minimal      1:1       functional
  Suthra                                                           180ms                  

  Dhamaka    #DC2626 Red   #FFFFFF White    Anton       2px        expressive   4:5       bold
                                                                   120ms                  

  Dil Se     #92400E Warm  #FDFAF6 Warm     Playfair    9999px     moderate     4:5       warm
  Desi       Brown         White            Display                240ms                  

  Shaahi     #1C1917 Near  #FAFAF9          Playfair    0px        minimal      3:4       premium
             Black         Off-White        Display                300ms                  

  Taza Aur   #7C3AED       #FFFFFF White    Anton       9999px     expressive   1:1       bold
  Mast       Purple                                                150ms                  

  Swasth Aur #166534 Green #F7FAF7 Pale     Playfair    9999px     minimal      4:5       warm
  Sachcha                  Green            Display                200ms                  

  Gyaan Aur  #1E3A5F Navy  #FFFFFF White    system-ui   6px        minimal      1:1       clinical
  Bharosa                                                          160ms                  

  Rooh Aur   #7C2D12       #FDFAF6 Saffron  Playfair    9999px     minimal      4:5       sacred
  Riwaz      Burgundy      Cream            Display                280ms                  

  Rasoi Aur  #7F1D1D Dark  #FFFBF7 Warm     Dancing     9999px     moderate     4:5       sensorial
  Pyaar      Red           Cream            Script                 220ms                  

  Tech Aur   #38BDF8 Cyan  #0F172A Dark     system-ui   6px        minimal      1:1       functional
  Takneek                  Slate                                   140ms                  
  ---------- ------------- ---------------- ----------- ---------- ------------ --------- ------------

**8. The Alive Engine --- Motion**

The Alive Engine is the motion layer. It runs on five Framer Motion
primitives, each calibrated per mood card. Motion is what makes a store
feel alive or dead --- it is the last sensory layer, the one that cannot
exist in a screenshot. Every primitive respects the
prefers-reduced-motion accessibility setting: when active, all duration
drops to zero and all scale drops to one instantly.

  --------------- ------------------ ---------------- ---------------------------
  **Primitive**   **What It Does**   **Where          **Per-Card Notes**
                                     Applied**        

  FadeIn          Sections and       Every content    yOffset varies: Rooh gets
                  components fade in section on every 24px for a more meditative
                  as buyer scrolls.  page, staggered  reveal. Dhamaka and Taza
                  Fires once. Never  in grids and     get 8px for instant energy.
                  re-animates.       lists.           

  ScaleTap        Tactile scale      Every CTA,       Scale value varies per
                  feedback on every  button, product  card: Shaahi 0.99 (barely
                  interactive        card, and link   perceptible), Dhamaka 0.95
                  element. The       sitewide.        (pronounced), Taza 0.95,
                  single motion                       Rooh 0.99.
                  change that makes                   
                  a store feel                        
                  premium on mobile.                  

  Magnetic        Cursor-aware       PDP primary CTA  Strength varies per card:
                  primary CTA on     and hero CTA.    barely perceptible on
                  desktop. CTA       Desktop only.    Shaahi, highly responsive
                  follows pointer                     on Dhamaka.
                  subtly as it                        
                  approaches, making                  
                  it feel alive.                      

  Parallax        Depth on hero      Hero images,     Most pronounced on Shaahi
                  images and gallery gallery          and Rasoi where photography
                  photography as     sections,        is the primary emotional
                  buyer scrolls.     featured         instrument. Minimal on tech
                  Creates visual     photography.     cards.
                  depth without page Desktop only via 
                  complexity.        md: scope.       

  Shimmer         Loading skeleton   Loading states   Shimmer base and highlight
                  animation for all  sitewide. CTA    tokens per card: dark cards
                  async content. On  sweep on Dhamaka use dark shimmer palette,
                  Dhamaka and Taza   and Taza only.   light cards use light.
                  only, a single     Fires once on    
                  light sweep across page load.       
                  the CTA on page                     
                  load draws the eye                  
                  to the action                       
                  immediately.                        
  --------------- ------------------ ---------------- ---------------------------

**Per-Card Motion Calibration**

  ------------ ------------ ------------ --------------- ---------------------------
  **Mood       **Motion     **Enter      **Scale-Tap**   **Character**
  Card**       Profile**    Duration**                   

  Saaf Suthra  minimal      180ms        0.98            Functional --- motion
                                                         serves orientation, not
                                                         delight

  Dhamaka      expressive   120ms        0.95            The fastest, most
                                                         pronounced. Every tap feels
                                                         like a pump of energy.

  Dil Se Desi  moderate     240ms        0.98            Unhurried. Motion gives
                                                         space for the story to
                                                         breathe.

  Shaahi       minimal      300ms        0.99            The slowest motion in the
                                                         system. Luxury unfolds,
                                                         never rushes.

  Taza Aur     expressive   150ms        0.95            Second fastest. Playful and
  Mast                                                   springy. The store feels
                                                         young.

  Swasth Aur   minimal      200ms        0.98            Calm and grounded. Motion
  Sachcha                                                reflects the product\'s
                                                         natural pace.

  Gyaan Aur    minimal      160ms        0.98            Efficient. Motion does its
  Bharosa                                                job and stays out of the
                                                         way.

  Rooh Aur     minimal      280ms        0.99            Second slowest. Sacred
  Riwaz                                                  rhythm --- everything has
                                                         weight and intention.

  Rasoi Aur    moderate     220ms        0.97            Warm and inviting. Motion
  Pyaar                                                  feels like something being
                                                         stirred.

  Tech Aur     minimal      140ms        0.97            Second fastest. Precise and
  Takneek                                                snappy. Technical
                                                         efficiency.
  ------------ ------------ ------------ --------------- ---------------------------

**9. Navigation and Footer Per Mood Card**

The navigation bar and footer are LOCKED components --- they cannot be
suppressed or structurally overridden. But they are not visually
identical across mood cards. The nav and footer absorb the mood card\'s
visual language exactly as every other component does. The nav reads
from pg_store_pages for its links. The footer reads policy page links
from pg_store_pages, collection links from the collections table, and
social links from stores.social_links.

**Navigation Specifications Per Mood Card**

  ---------- ------------------------ -------------------- --------------------- ----------- -------------- ------------
  **Mood     **Background**           **Logo Treatment**   **Nav Links**         **Cart**    **Mobile       **Height**
  Card**                                                                                     Drawer**       

  Saaf       White + bottom border    system-ui semibold,  text-secondary 150ms  Icon + navy Slides right,  56px
  Suthra                              text-primary         transition            badge       white bg       
                                                                                 rounded                    

  Dhamaka    Transparent over hero â†’  Anton black          uppercase             Icon +      Slides LEFT    60px
             white on scroll          uppercase --- white  tracking-wide, medium square red  (reversed),    
             (IntersectionObserver)   on transparent, dark weight                badge (no   dark bg        
                                      on white                                   radius)     #111827, Anton 
                                                                                             uppercase      
                                                                                             white          

  Dil Se     Warm bg-primary, bottom  Playfair font-normal font-normal           Icon +      Slides right,  64px (taller
  Desi       border                   text-xl, TWO-LINE    text-secondary        rounded     warm           for 2-line
                                      logo (brand name +   hover:primary         badge       bg-primary,    logo)
                                      maker name)                                            Playfair       
                                                                                             text-xl        

  Shaahi     bg-primary (off-white),  Playfair             text-xs               Text \"BAG  Full-screen    72px
             NO border --- separation tracking-\[0.2em\]   tracking-\[0.15em\]   (0)\" ---   OVERLAY (not   (tallest
             from bg only             uppercase text-base  uppercase, active =   no icon.    drawer),       nav)
                                      text-primary ---     border-b underline    Luxury      centred links  
                                      extremely tracked,   only (no colour       doesn\'t    Playfair       
                                      small                change)               use cart    text-2xl,      
                                                                                 icons.      600ms fade     

  Taza Aur   White + bottom border    Anton font-black     uppercase             Icon +      Slides right,  56px
  Mast                                uppercase text-xl    tracking-wide         purple      white bg,      
                                      text-primary         font-semibold         rounded     Anton          
                                      (purple)                                   badge.      uppercase      
                                                                                 ScaleTap    font-black     
                                                                                 animation   text-2xl       
                                                                                 when item   text-primary   
                                                                                 added.                     

  Swasth Aur White + bottom border    font-semibold        font-normal           Icon +      Slides right,  56px
  Sachcha                             text-lg text-primary text-secondary        green       white bg       
                                      (green)              hover:primary         rounded                    
                                                                                 badge                      

  Gyaan Aur  White + bottom border    font-semibold        font-medium           Icon + navy Slides right,  56px
  Bharosa                             tracking-tight       text-secondary        rounded     white bg       
                                      text-primary         hover:primary         badge                      

  Rooh Aur   bg-primary (saffron      Playfair             text-xs               Text \"CART Full-screen    68px
  Riwaz      cream), very faint warm  tracking-widest      tracking-widest       (0)\" ---   overlay, warm  
             border                   text-lg (widest      uppercase, active =   no icon     bg, Playfair   
                                      tracking in system)  text-primary + gold   (same as    text-2xl       
                                                           dot below via ::after Shaahi)     centred, gold  
                                                                                             dot separators 

  Rasoi Aur  bg-primary (warm cream), Dancing Script       font-normal           Icon +      Slides right,  64px
  Pyaar      bottom border            font-normal text-2xl text-secondary        rounded     warm bg,       
                                      text-primary ---     hover:primary         badge       Dancing Script 
                                      most distinctive nav                                   text-2xl       
                                      logo in system                                         text-primary   

  Tech Aur   bg-primary (#0F172A      font-bold font-mono  font-mono uppercase   No icon.    Slides right,  60px
  Takneek    dark), bottom border     uppercase            tracking-widest       Mono text.  dark bg,       
                                      tracking-widest      text-secondary        Cyan badge, font-mono      
                                      text-white           hover:text-primary    no radius,  uppercase      
                                                           (cyan)                dark text   font-bold      
                                                                                             text-xl        
                                                                                             text-white     
  ---------- ------------------------ -------------------- --------------------- ----------- -------------- ------------

**Scroll Behaviour --- Universal**

One scroll rule applies to all mood cards: the nav border and shadow
appear only when scrollY \> 10. At the very top of the page the nav and
hero feel continuous --- no border separates them. The border and shadow
appear the moment the buyer has scrolled. Dhamaka has an additional
rule: the nav is transparent over the hero image and transitions to
solid white when the hero section leaves the viewport, via
IntersectionObserver.

**Footer Specifications Per Mood Card**

  ---------- ------------------------ -------------------- --------------------------------------
  **Mood     **Background**           **Brand Treatment**  **Special Details**
  Card**                                                   

  Saaf       White + top border       font-semibold        Standard 3-column layout. Functional.
  Suthra                              text-base            
                                      text-primary         

  Dhamaka    #111827 dark + no top    Anton uppercase      Dark footer --- deliberate contrast
             border                   font-black text-lg   from white page. Energy doesn\'t stop
                                      text-white           at the fold.

  Dil Se     bg-primary warm, top     Playfair font-normal Tagline in italic text-secondary.
  Desi       border                   text-xl              Maker warmth extends to footer.

  Shaahi     bg-primary off-white,    Playfair             Gold thread separator (barely
             top border: border-t     tracking-\[0.2em\]   visible). All text extra-tracked
             border-\[accent-gold\]   uppercase text-sm    uppercase. Copyright at 60% opacity.
             opacity-30                                    

  Taza Aur   bg-secondary light       Anton uppercase      Column headers in primary purple.
  Mast       purple #F5F3FF, top      font-black text-lg   Links font-medium.
             border                   text-primary         

  Swasth Aur #F7FAF7 palest green     font-semibold        All other treatments same as Saaf
  Sachcha    tint, top border         text-base            Suthra with green primary.
                                      text-primary         

  Gyaan Aur  #F0F4F8 clinical grey,   font-semibold        Clinical pattern --- same as Saaf
  Bharosa    top border               tracking-tight       Suthra with navy primary. Functional.
                                      text-primary         

  Rooh Aur   bg-primary saffron       Playfair             Gold dot separators between policy
  Riwaz      cream, top border:       tracking-widest      links (not \| characters). Sacred
             barely visible gold      text-lg              space extends to footer.
             opacity-20                                    

  Rasoi Aur  bg-primary warm cream,   Dancing Script       Tagline in italic. Same pattern as Dil
  Pyaar      top border               font-normal text-2xl Se Desi but warmer. Kitchen extends to
                                      text-primary         footer.

  Tech Aur   bg-primary #0F172A dark, font-bold font-mono  All text font-mono. Tagline font-mono
  Takneek    top border               uppercase            text-secondary. Copyright at 50%
                                      tracking-widest      opacity. Dark throughout.
                                      text-white           
  ---------- ------------------------ -------------------- --------------------------------------

**10. The Complete Page System**

Every page a buyer visits is governed by the pg_store_pages registry ---
the single source of truth for page existence, status, navigation
membership, and default content. Every page inherits the mood card\'s
visual language. The intelligence layer computes a default composition
for the homepage based on archetype, category, and commerce
architecture.

**10.1 Page Governance Levels**

  ------------- ---------------- -------------------------------------------------
  **Page**      **Governance**   **Seller Freedom**

  Product       Tightest         Component overrides within guardrails.
  Detail Page                    Intelligence layer decides default. LOCKED
                                 components cannot be touched.

  Homepage      Most open        Freely add, remove, and reorder any block.
                                 Intelligence provides a personalised starting
                                 point. 14 block types available.

  Collections   Medium           Layout variant, filter prominence, category
                                 banner, grid density.

  Checkout      Low              Full token consumption via ThemeProvider 
                                 for every input, button, and error 
                                 state. RTO Engine interventions (gates, 
                                 banners) are First-Class Components in 
                                 the registry, ensuring they look native 
                                 to the brand.

  Cart          Low              Visual tokens. Free Shipping progress bar
                                 configurable. Cross-sell block activatable.

  Policy and    Medium           Full content editing. SEO fields. Mood card
  Static Pages                   governs visual expression automatically.

  About Page    Medium-High      All four components freely activatable. Founder
                                 story, mission, craft section, team,
                                 certifications, contact CTA.

  Custom Pages  Full             Everything. Built from a blank canvas with mood
                                 card tokens applied automatically. Can be added
                                 to nav.
  ------------- ---------------- -------------------------------------------------

**10.2 The 5 Homepage Templates**

The intelligence layer selects one of five named homepage templates for
each store, based on archetype Ã— category Ã— commerce architecture. Each
template is an ordered sequence of homepage blocks drawn from the 14
available block types.

  --------------- ------------------ -------------------------------------
  **Template**    **Best For**       **Opening Block Sequence**

  Product Engine  High-urgency       Hero Banner â†’ Trust Bar â†’ Featured
  Standard        single-product or  Products â†’ Testimonials â†’ Brand Story
                  focused catalogue  â†’ Email Capture
                  sellers. Pure      
                  Dropshipper, Early 
                  D2C Brand.         

  Story-First     Craft makers,      Hero Banner â†’ Brand Story â†’ Featured
  Maker           artisans, heritage Products â†’ Instagram Feed â†’
                  sellers,           Testimonials â†’ Trust Bar
                  cause-driven       
                  brands.            

  Catalog Browser Large catalogues,  Announcement Bar â†’ Category
                  multi-category     Navigation Tiles â†’ Featured Products
                  stores,            â†’ Collection Banners â†’ Trust Bar â†’
                  marketplace        Testimonials
                  migrators.         

  Knowledge       Expert sellers,    Hero (Clinical) â†’ Trust Bar
  Authority       clinical brands,   (certifications) â†’ Featured Products
                  wellness           â†’ Expert Quote / Press â†’ Brand Story
                  practitioners with â†’ Reviews
                  scientific         
                  backing.           

  Community Brand Instagram sellers, Hero (UGC) â†’ Instagram Feed â†’
                  influencers,       Featured Products â†’ Testimonials â†’
                  social commerce    Brand Story â†’ Email / WhatsApp
                  brands with        Capture
                  existing           
                  audiences.         
  --------------- ------------------ -------------------------------------

**10.3 The 14 Homepage Block Types**

  ---------------- ------------- ------------------------------------------
  **Block**        **Component   **When Used**
                   ID**          

  Hero Banner ---  COMP_HP_001   Default hero. All templates. Mood card
  Full Width                     governs photography style, overlay,
                                 typography.

  Hero --- Split   COMP_HP_002   Story-first templates. Image left, story
  Layout                         text right.

  Hero --- Story   COMP_HP_003   Community brand template. Creator video as
  Video                          hero.

  Featured         COMP_HP_004   All templates. Mood card governs grid
  Products Strip                 density, card style, hover behaviour.

  Category         COMP_HP_005   Catalog-First architecture. 3+ categories.
  Navigation Tiles               

  Brand Story      COMP_HP_006   All templates except pure catalog. Seeded
  Section                        from archetype content.

  Testimonials     COMP_HP_007   Activates when 3+ reviews exist. Mood card
  Strip                          governs visual treatment.

  Instagram / UGC  COMP_HP_008   Social-native archetypes (Digital First,
  Feed                           Influencer, Instagram Seller) when feed
                                 connected.

  Trust Bar ---    COMP_HP_009   All templates. Content varies: functional
  Homepage                       for Saaf Suthra, botanical for Swasth,
                                 sacred for Rooh.

  Announcement Bar COMP_HP_010   All templates. Above hero. Mood card
                                 governs colour treatment.

  Collection       COMP_HP_011   2+ collections. Catalog-First.
  Banners Grid                   

  Newsletter /     COMP_HP_012   All templates. Content seeds: tagline or
  WhatsApp Optin                 brand name from seller profile.

  Press / As Seen  COMP_HP_013   Established brands, Growth Stage
  In Strip                       archetypes with press coverage.

  Certifications   COMP_HP_014   Knowledge expert, Swasth, Gyaan, health
  Block                          and food categories.
  ---------------- ------------- ------------------------------------------

**10.4 Personalised Dummy Content**

At the post-onboarding preview moment --- the first time a seller sees
their store --- every page is already populated with personalised
content. Not lorem ipsum. A store that already looks like their brand.

Content comes from two sources. First, direct from onboarding answers:
brand name, product name, category, founder name. Second, archetype and
category derived: tagline, hero headline, hero subheadline, brand story
short, trust statement, USP 1, USP 2, USP 3.

  ---------------------- ------------------------------------------------
  **Archetype Cluster**  **Default Hero Headline**

  craft_maker            Made by hand. Made for you.

  knowledge_expert       Science-backed. Results you can feel.

  digital_native         Built different. Priced for everyone.

  dropshipper            The best products. Delivered fast.

  social_commerce        As seen on your feed. Now at your door.

  family_business        Three generations of craft. One store.

  cause_driven           Made with purpose. Delivered with pride.

  lifestyle_expert       Your practice, extended into daily life.

  growth_hustler         Quality you can feel. Prices that make sense.

  trust_seeker           Trusted by thousands. Now delivered to you.
  ---------------------- ------------------------------------------------

Hero images are selected from a curated Unsplash library of 5 images per
category (15 categories Ã— 5 = 75 curated images). Selection is
deterministic per store --- the same store always gets the same image.
No placeholder, no broken image state at launch.

**11. Image Quality and Photography System**

Image quality is the single most visible product quality signal on any
D2C store. A perfect conversion architecture is undermined by blurry
photos, white backgrounds in lifestyle contexts, or mismatched aspect
ratios. The system has a classification and damage-control system for
every image quality tier.

**11.1 The Four Image Quality Tiers**

  -------------- ------------------ ------------------------------------------
  **Tier**       **Description**    **System Response**

  Tier 1 ---     Studio-quality or  Full expression. Parallax active on Shaahi
  Professional   professional       and Rasoi. Gallery Zone given maximum
                 lifestyle          prominence.
                 photography.       
                 Correct aspect     
                 ratio for the mood 
                 card. Consistent   
                 lighting.          

  Tier 2 ---     Decent phone       Standard treatment. Gallery Zone normal
  Good Amateur   photography. Good  prominence. No parallax.
                 lighting but       
                 inconsistent. Some 
                 white background   
                 images.            

  Tier 3 ---     White background   Damage control: Gallery Zone still leads
  Basic          product shots      but above-fold secondary is shifted to the
                 only. No lifestyle next most persuasive element (trust bar or
                 content.           social proof). Content zone weighted up.
                 Technically        System recommends AI content upgrade.
                 correct but low    
                 desire creation.   

  Tier 4 ---     Blurry, dark,      Maximum damage control: Gallery Zone
  Poor           cluttered          de-emphasised. Review section and trust
                 backgrounds,       signals elevated. System surfaces a
                 inconsistent       content generation prompt with real
                 crops.             urgency scoring.
  -------------- ------------------ ------------------------------------------

**11.2 Photography Guidance Per Mood Card**

  ---------- ------------------------- ----------------------------------
  **Mood     **Photography Style**     **Avoid**
  Card**                               

  Saaf       Clean product on white or Cluttered backgrounds, lifestyle
  Suthra     minimal light grey. Clear distractions, inconsistent
             subject. Consistent       lighting
             framing.                  

  Dhamaka    High-contrast editorial.  Soft, romantic, or muted
             Model in motion if        photography --- kills the energy
             fashion. Product in       
             dramatic lighting. Bold   
             colour pops.              

  Dil Se     Warm natural settings.    Clinical white backgrounds, studio
  Desi       Hands visible. Imperfect  flash --- removes the humanity
             textures. Handmade        
             process shots.            
             Earth-toned props.        

  Shaahi     Curated lifestyle         Anything that looks rushed, bright
             settings. Elegant props.  flash, plastic props
             Soft window light.        
             Editorial aspirational    
             framing. Slow reveal.     

  Taza Aur   Real people using the     Overly polished studio shots ---
  Mast       product. UGC-feel.        feels inauthentic to the audience
             Natural outdoor light.    
             Fun and candid.           

  Swasth Aur Ingredients close-up.     Artificial lighting, plastic
  Sachcha    Natural textures. Morning packaging shots, non-natural
             light. Outdoor botanical  environments
             settings. Pure materials. 

  Gyaan Aur  Clinical product shots.   Overly warm or emotional
  Bharosa    Lab or science settings.  photography --- undermines
             Ingredient close-ups.     clinical authority
             Before/after clinical     
             documentation.            

  Rooh Aur   Sacred settings. Diyas,   Commercial-feeling shots, bright
  Riwaz      flowers, natural          flash, plastic props
             materials. Soft warm      
             candlelight. Reverent     
             framing. Intentional      
             placement.                

  Rasoi Aur  Close-up food             White studio backgrounds, cold
  Pyaar      photography. Steam        lighting --- appetite dies
             visible. Textures and     
             colours prominent. Hands  
             preparing. Warm kitchen   
             settings.                 

  Tech Aur   Product against dark      Lifestyle or emotional photography
  Takneek    background. Dramatic      --- signals the wrong message
             lighting picking out      
             form. Spec close-ups.     
             Technical detail shots.   
  ---------- ------------------------- ----------------------------------

**12. The Design Token System**

Design tokens are the bridge between the mood card data and the
storefront rendering. Every mood card\'s 50+ token values are injected
as CSS custom properties at the store root by ThemeProvider. Every
component reads only these custom properties --- never a hardcoded
value. This is what makes the universal translation principle possible.

**The Universal Translation Principle**

Any component that enters the page --- whether activated by the
intelligence layer, the category modifier, or a seller override --- is
automatically absorbed and expressed in the current mood card\'s visual
language. A component cannot look out of place because it has no
opinions of its own. It asks the token system what colour to use. It
asks the token system what radius. It asks the token system what motion
duration.

+-----------------------------------------------------------------------+
| **The Rule**                                                          |
|                                                                       |
| No component ever reads a hardcoded colour, radius, shadow, motion    |
| duration, or spacing value.                                           |
|                                                                       |
| Every visual decision flows through CSS custom properties from the    |
| mood card token set.                                                  |
|                                                                       |
| This is non-negotiable. A \"strip pass\" is required on every new     |
| component before it enters the codebase.                              |
+-----------------------------------------------------------------------+

**The Complete Token Categories**

  ------------------ ------------------------------ ----------------------
  **Token Category** **Tokens**                     **What They Control**

  Typography         heading_font, body_font,       All text rendering
                     accent_font,                   across the entire
                     display_font_stack,            store
                     body_font_stack,               
                     font_scale_heading_xl,         
                     font_scale_heading_lg,         
                     font_scale_body,               
                     font_weight_display,           
                     font_weight_body,              
                     letter_spacing_display         

  Colour --- Brand   primary_colour,                The mood card\'s
                     secondary_colour,              signature palette
                     accent_colour,                 
                     accent_colour_2, accent_gold   

  Colour --- Surface background_colour, bg_hero,    Page backgrounds, card
                     bg_secondary, surface_colour   surfaces, hero
                                                    overlays

  Colour --- Text    text_primary_colour,           All readable text
                     text_secondary_colour,         across all contexts
                     text_on_dark                   

  Colour --- CTA     cta_colour, cta_text_colour    Primary call-to-action
                                                    buttons sitewide

  Colour ---         urgency_bg, urgency_text,      Urgency signals,
  Conversion         callout_bg, callout_border,    callout boxes, trust
                     badge_bg, badge_text,          badges, review stars
                     star_colour                    

  Colour ---         border_colour, border_dark     All borders and
  Interface                                         dividers

  Radius             border_radius_button,          All rounded corners
                     border_radius_card,            across all elements
                     border_radius_image,           
                     border_radius_badge,           
                     hero_radius                    

  Shadow             shadow_intensity,              Depth and elevation
                     shadow_style, shadow_token,    across all components
                     shadow_hover, shadow_cta       

  Motion             motion_profile,                All animation,
                     motion_enter_duration,         transition, and
                     motion_easing,                 loading state
                     motion_scale_tap,              behaviour
                     motion_duration, shimmer_base, 
                     shimmer_highlight              

  Micro-             opacity_hover, scale_hover,   Visual response and 
  Interactions       shadow_active, border_focus   affordance across all 
                                                   interactive elements

  Iconography        icon_set, icon_weight,        Dynamic icon rendering 
                     icon_style                    bridged to the Mood 
                                                   Card aesthetic

  Interface Details  border_width_input,           Precision control over 
                     border_width_card,            the UI skeleton and 
                     focus_ring_colour,            accessibility cues
                     focus_ring_style              

  Spacing            density_multiplier,            All layout spacing ---
                     spacing_scale, section_gap,    sections, components,
                     component_gap,                 internal padding
                     component_gap_light            

  Image              image_ratio_pdp, image_style   PDP gallery aspect
                                                    ratio and photography
                                                    treatment guidance

  Tone               content_tone                   AI content generation
                                                    tone. Human-readable
                                                    for copywriters.
  ------------------ ------------------------------ ----------------------

**The Four Component Translation Families**

The Design Reference System organises how each token category applies to
component families:

  ------------- ------------------ ----------------------------------------
  **Family**    **Components**     **Key Token Interactions**

  Family 1 ---  Navigation, Hero,  bg tokens, text tokens, border tokens,
  Structural    Page layout,       spacing tokens. Structure is the
                Footer             moodboard for everything else.

  Family 2 ---  Trust bars,        badge_bg, badge_text,
  Trust &       badges,            border_radius_badge, content_tone. Trust
  Credibility   certification      signals must feel native to the mood
                blocks, COD badge, card, not generic.
                return policy,     
                authenticity badge 

  Family 3 ---  Stock counter,     urgency_bg, urgency_text, cta_colour,
  Urgency &     urgency timer,     cta_text_colour, border_radius_button.
  Conversion    social pulse, CTA  Urgency must be calibrated to the mood
                block, sticky CTA, card personality --- Rooh never uses a
                offer cluster      countdown timer.

  Family 4 ---  Size guide,        Inherits all surface tokens. Module
  Category      ingredient block,  containers use callout_bg and
  Modules       specs table,       callout_border. Typography uses body
                ritual guide,      font and body scale.
                before/after       
                slider,            
                nutritional table, 
                dosage             
                instructions       
  ------------- ------------------ ----------------------------------------

**The System Contract**

**Every component trusts the token system.**

**Every decision trusts the intelligence layer.**

**Every seller trusts the architecture.**

*The architecture\'s job is to make the best decision for the seller\'s
specific buyer psychology. The designer\'s job is to ensure no component
ever breaks that trust by hardcoding a visual decision that belongs to
the token system. The writer\'s job is to ensure the content tone
matches the mood card\'s voice. The system works only when every layer
does its job.*

Easy D2C Â· Product & Design System Reference Â· Version 1.0 Â·
Confidential Â· 2026

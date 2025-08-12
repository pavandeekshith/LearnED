import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calculator, Microscope, Atom, ChevronDown, ChevronRight, Download, Eye, Users, GraduationCap } from 'lucide-react';

const Academics = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Comprehensive Syllabus Data Structure
  const syllabusData = {
    // NCERT Curriculum (Classes 2-12)
    'ncert': {
      '2': {
        name: 'Class 2',
        age: '7-8 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Building strong mathematical foundations through play and exploration',
            topics: [
              { title: 'What is Long, What is Round?', subtopics: ['Measurement concepts', 'Comparison of lengths', 'Understanding shapes'] },
              { title: 'Counting in Groups', subtopics: ['Skip counting', 'Grouping objects', 'Basic number patterns'] },
              { title: 'How Much Can You Carry?', subtopics: ['Weight concepts', 'Capacity understanding', 'Practical measurement'] },
              { title: 'Counting in Tens', subtopics: ['Place value basics', 'Tens and ones', 'Number building'] },
              { title: 'Patterns', subtopics: ['Shape patterns', 'Number patterns', 'Color patterns'] },
              { title: 'Footprints', subtopics: ['Measurement through steps', 'Distance concepts', 'Size comparison'] },
              { title: 'Jugs and Mugs', subtopics: ['Capacity measurement', 'Volume concepts', 'Container comparison'] },
              { title: 'Tens and Ones', subtopics: ['Place value system', 'Number composition', 'Basic addition'] },
              { title: 'My Funday', subtopics: ['Time concepts', 'Daily routine', 'Clock reading basics'] },
              { title: 'Add Our Points', subtopics: ['Basic addition', 'Number combinations', 'Mental math'] },
              { title: 'Lines and Lines', subtopics: ['Straight and curved lines', 'Line patterns', 'Basic geometry'] },
              { title: 'Give and Take', subtopics: ['Addition and subtraction', 'Number relationships', 'Problem solving'] },
              { title: 'The Longest Step', subtopics: ['Distance measurement', 'Comparison skills', 'Estimation'] },
              { title: 'Birds Come, Birds Go', subtopics: ['Addition and subtraction stories', 'Number changes', 'Word problems'] },
              { title: 'How Many Ponytails', subtopics: ['Multiplication concepts', 'Equal groups', 'Repeated addition'] }
            ]
          },
          science: {
            name: 'Environmental Science',
            icon: Microscope,
            color: 'green',
            description: 'Discovering the world around us through observation and exploration',
            topics: [
              { title: 'Growing Up', subtopics: ['Life stages', 'Growth patterns', 'Changes in living things'] },
              { title: 'Our Sense Organs', subtopics: ['Five senses', 'How we perceive', 'Sensory exploration'] },
              { title: 'Food and Water', subtopics: ['Healthy eating', 'Water importance', 'Food sources'] },
              { title: 'Clothes to Wear', subtopics: ['Different fabrics', 'Weather appropriate clothing', 'Cultural dress'] },
              { title: 'Different House', subtopics: ['Types of homes', 'House materials', 'Shelter needs'] },
              { title: 'Our Daily Routine', subtopics: ['Time management', 'Daily activities', 'Healthy habits'] },
              { title: 'Celebrations with Family', subtopics: ['Family traditions', 'Special occasions', 'Community bonds'] },
              { title: 'Festivals We Celebrate', subtopics: ['Cultural festivals', 'Seasonal celebrations', 'Community participation'] },
              { title: 'Our Neighbours', subtopics: ['Community helpers', 'Neighborhood relationships', 'Social bonds'] },
              { title: 'Animals and their Shelters', subtopics: ['Animal homes', 'Habitat needs', 'Animal care'] },
              { title: 'Natural Man-made Things', subtopics: ['Natural vs artificial', 'Material classification', 'Environmental awareness'] },
              { title: 'Weather and Seasons', subtopics: ['Seasonal changes', 'Weather patterns', 'Climate effects'] },
              { title: 'Means of Communication', subtopics: ['How we communicate', 'Communication methods', 'Technology in communication'] },
              { title: 'The Earth', subtopics: ['Our planet', 'Earth features', 'Living environment'] },
              { title: 'The Sun, the Moon and the Stars', subtopics: ['Sky objects', 'Day and night', 'Space exploration'] }
            ]
          }
        }
      },
      '3': {
        name: 'Class 3',
        age: '8-9 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Developing mathematical thinking and problem-solving skills',
            topics: [
              { title: 'Where to Look From', subtopics: ['Directions and positions', 'Spatial understanding', 'Maps and directions'] },
              { title: 'Fun With Numbers', subtopics: ['Number games', 'Number relationships', 'Mental math strategies'] },
              { title: 'Give and Take', subtopics: ['Advanced addition/subtraction', 'Borrowing and carrying', 'Multi-digit operations'] },
              { title: 'Long and Short', subtopics: ['Length measurement', 'Standard units', 'Comparison and estimation'] },
              { title: 'Shapes and Designs', subtopics: ['2D and 3D shapes', 'Shape properties', 'Pattern creation'] },
              { title: 'Fun With Give and Take', subtopics: ['Word problems', 'Real-life applications', 'Problem-solving strategies'] },
              { title: 'Time Goes On', subtopics: ['Reading time', 'Time duration', 'Calendar concepts'] },
              { title: 'Who is Heavier?', subtopics: ['Weight comparison', 'Standard units of weight', 'Balancing'] },
              { title: 'How Many Times?', subtopics: ['Multiplication concepts', 'Tables practice', 'Repeated addition'] },
              { title: 'Play With Patterns', subtopics: ['Number patterns', 'Shape patterns', 'Pattern completion'] },
              { title: 'Jugs and Mugs', subtopics: ['Capacity and volume', 'Liquid measurement', 'Container comparison'] },
              { title: 'Can We Share?', subtopics: ['Division concepts', 'Equal sharing', 'Grouping'] },
              { title: 'Smart Charts!', subtopics: ['Data collection', 'Simple graphs', 'Chart interpretation'] },
              { title: 'Rupees and Paise', subtopics: ['Money concepts', 'Currency recognition', 'Simple transactions'] }
            ]
          },
          science: {
            name: 'Environmental Science',
            icon: Microscope,
            color: 'green',
            description: 'Exploring nature and understanding our environment',
            topics: [
              { title: 'Poonam\'s Day Out', subtopics: ['Daily life observations', 'Environmental awareness', 'Nature exploration'] },
              { title: 'The Plant Fairy', subtopics: ['Plant parts', 'Plant growth', 'Plant importance'] },
              { title: 'Water O\' Water!', subtopics: ['Water cycle', 'Water sources', 'Water conservation'] },
              { title: 'Our First School', subtopics: ['School environment', 'Learning spaces', 'Educational journey'] },
              { title: 'Chhotu\'s House', subtopics: ['Home environment', 'Family life', 'Household activities'] },
              { title: 'Foods We Eat', subtopics: ['Food groups', 'Nutrition', 'Healthy eating habits'] },
              { title: 'Saying Without Speaking', subtopics: ['Non-verbal communication', 'Body language', 'Sign language'] },
              { title: 'Flying High', subtopics: ['Birds and flight', 'Animal adaptations', 'Sky observations'] },
              { title: 'It\'s Raining', subtopics: ['Weather phenomena', 'Rain cycle', 'Seasonal changes'] },
              { title: 'What is Cooking', subtopics: ['Food preparation', 'Kitchen science', 'Cooking processes'] },
              { title: 'From Here to There', subtopics: ['Transportation', 'Journey concepts', 'Travel methods'] },
              { title: 'Work We Do', subtopics: ['Different occupations', 'Community helpers', 'Work importance'] },
              { title: 'Sharing Our Feelings', subtopics: ['Emotional expression', 'Communication skills', 'Social relationships'] },
              { title: 'The Story of Food', subtopics: ['Food sources', 'Food journey', 'Agricultural practices'] },
              { title: 'Making Pots', subtopics: ['Handicrafts', 'Traditional skills', 'Creative expression'] },
              { title: 'Games We Play', subtopics: ['Physical activity', 'Traditional games', 'Sports and health'] },
              { title: 'Here Comes A Letter', subtopics: ['Postal system', 'Communication methods', 'Letter writing'] },
              { title: 'A House Like This!', subtopics: ['Architecture', 'Building materials', 'Shelter designs'] },
              { title: 'Our Friends – Animals', subtopics: ['Animal behavior', 'Pet care', 'Wildlife conservation'] },
              { title: 'Drop by Drop', subtopics: ['Water conservation', 'Water usage', 'Environmental responsibility'] },
              { title: 'Families Can Be Different', subtopics: ['Family diversity', 'Social structures', 'Cultural differences'] },
              { title: 'Left-Right', subtopics: ['Directional concepts', 'Spatial awareness', 'Navigation skills'] },
              { title: 'A Beautiful Cloth', subtopics: ['Textile production', 'Traditional crafts', 'Cultural heritage'] },
              { title: 'Web of Life', subtopics: ['Ecosystem connections', 'Food chains', 'Environmental balance'] }
            ]
          }
        }
      },
      '4': {
        name: 'Class 4',
        age: '9-10 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Building strong mathematical foundations with practical applications',
            topics: [
              { title: 'Building with Bricks', subtopics: ['3D shapes and structures', 'Volume concepts', 'Spatial visualization'] },
              { title: 'Long and Short', subtopics: ['Measurement units', 'Length conversions', 'Estimation skills'] },
              { title: 'A Trip to Bhopal', subtopics: ['Distance and travel', 'Map reading', 'Route planning'] },
              { title: 'Tick-Tick-Tick', subtopics: ['Time measurement', 'Clock reading', 'Time calculations'] },
              { title: 'The Way the World Looks', subtopics: ['Mapping skills', 'Scale and proportion', 'Geographic concepts'] },
              { title: 'The Junk Seller', subtopics: ['Data handling', 'Sorting and classifying', 'Graph interpretation'] },
              { title: 'Jugs and Mugs', subtopics: ['Capacity measurement', 'Volume calculations', 'Liquid measurement'] },
              { title: 'Carts and Wheels', subtopics: ['Circular motion', 'Symmetry', 'Geometric patterns'] },
              { title: 'Halves and Quarters', subtopics: ['Fraction concepts', 'Part-whole relationships', 'Fraction operations'] },
              { title: 'Play with Patterns', subtopics: ['Number sequences', 'Pattern recognition', 'Mathematical patterns'] },
              { title: 'Tables and Shares', subtopics: ['Multiplication tables', 'Division concepts', 'Equal distribution'] },
              { title: 'How Heavy? How Light?', subtopics: ['Weight measurement', 'Mass concepts', 'Weighing techniques'] },
              { title: 'Fields and Fences', subtopics: ['Perimeter and area', 'Boundary concepts', 'Measurement applications'] },
              { title: 'Smart Charts', subtopics: ['Data representation', 'Chart creation', 'Statistical concepts'] }
            ]
          },
          science: {
            name: 'Environmental Science',
            icon: Microscope,
            color: 'green',
            description: 'Understanding scientific concepts through environmental exploration',
            topics: [
              { title: 'Going to School', subtopics: ['Transportation methods', 'Road safety', 'School environment'] },
              { title: 'Ear to Ear', subtopics: ['Communication systems', 'Sound transmission', 'Hearing mechanisms'] },
              { title: 'A Day with Nandu', subtopics: ['Animal behavior', 'Pet relationships', 'Animal care'] },
              { title: 'The Story of Amrita', subtopics: ['Environmental conservation', 'Tree protection', 'Ecological awareness'] },
              { title: 'Anita and the Honeybees', subtopics: ['Pollination process', 'Bee behavior', 'Ecosystem services'] },
              { title: 'Omana\'s Journey', subtopics: ['Travel experiences', 'Cultural diversity', 'Geographic features'] },
              { title: 'From the Window', subtopics: ['Observation skills', 'Environmental changes', 'Seasonal patterns'] },
              { title: 'Reaching Grandmother\'s House', subtopics: ['Family relationships', 'Travel planning', 'Distance concepts'] },
              { title: 'Changing Families', subtopics: ['Family structures', 'Social changes', 'Adaptation'] },
              { title: 'Hu Tu Tu, Hu Tu Tu', subtopics: ['Traditional games', 'Physical activity', 'Cultural heritage'] },
              { title: 'The Valley of Flowers', subtopics: ['Biodiversity', 'Plant varieties', 'Conservation efforts'] },
              { title: 'Changing Times', subtopics: ['Technological progress', 'Social evolution', 'Historical awareness'] },
              { title: 'A River\'s Tale', subtopics: ['Water systems', 'River ecosystems', 'Water conservation'] },
              { title: 'Basva\'s Farm', subtopics: ['Agricultural practices', 'Crop cultivation', 'Farming techniques'] },
              { title: 'From Market to Home', subtopics: ['Food supply chain', 'Market systems', 'Economic understanding'] },
              { title: 'A Busy Month', subtopics: ['Seasonal activities', 'Time management', 'Planning skills'] },
              { title: 'Nandita in Mumbai', subtopics: ['Urban life', 'City systems', 'Metropolitan challenges'] },
              { title: 'Too Much Water, Too Little Water', subtopics: ['Water scarcity', 'Flood management', 'Water cycle'] },
              { title: 'Abdul in the Garden', subtopics: ['Gardening practices', 'Plant care', 'Horticultural skills'] },
              { title: 'Eating Together', subtopics: ['Food sharing', 'Community dining', 'Social bonding'] },
              { title: 'Food and Fun', subtopics: ['Nutrition concepts', 'Food preparation', 'Healthy lifestyle'] },
              { title: 'The World in My Home', subtopics: ['Global connections', 'Cultural exchange', 'International awareness'] },
              { title: 'Pochampalli', subtopics: ['Traditional crafts', 'Weaving techniques', 'Cultural preservation'] },
              { title: 'Home and Abroad', subtopics: ['Migration patterns', 'Cultural adaptation', 'Global citizenship'] },
              { title: 'Spicy Riddles', subtopics: ['Problem-solving', 'Critical thinking', 'Logical reasoning'] },
              { title: 'Defence Officer: Wahida', subtopics: ['Career exploration', 'Service professions', 'Leadership qualities'] },
              { title: 'Chuskit Goes to School', subtopics: ['Educational access', 'Inclusive education', 'Overcoming challenges'] }
            ]
          }
        }
      },
      '5': {
        name: 'Class 5',
        age: '10-11 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematical concepts with real-world applications',
            topics: [
              { title: 'The Fish Tale', subtopics: ['Large numbers', 'Place value system', 'Number comparisons'] },
              { title: 'Shapes and Angles', subtopics: ['Geometric shapes', 'Angle measurement', 'Shape properties'] },
              { title: 'How Many Squares?', subtopics: ['Area concepts', 'Square units', 'Area calculations'] },
              { title: 'Parts and Wholes', subtopics: ['Fraction concepts', 'Equivalent fractions', 'Fraction operations'] },
              { title: 'Does it Look the Same?', subtopics: ['Symmetry', 'Reflection', 'Pattern symmetry'] },
              { title: 'Be My Multiple, I\'ll Be Your Factor', subtopics: ['Factors and multiples', 'Prime numbers', 'Number relationships'] },
              { title: 'Can You See the Pattern?', subtopics: ['Number patterns', 'Sequence recognition', 'Pattern continuation'] },
              { title: 'Mapping Your Way', subtopics: ['Scale and maps', 'Direction concepts', 'Distance measurement'] },
              { title: 'Boxes and Sketches', subtopics: ['3D visualization', 'Net of shapes', 'Spatial understanding'] },
              { title: 'Tenths and Hundredths', subtopics: ['Decimal concepts', 'Decimal operations', 'Decimal-fraction relationship'] },
              { title: 'Area and its Boundary', subtopics: ['Perimeter and area', 'Measurement techniques', 'Practical applications'] },
              { title: 'Smart Charts', subtopics: ['Data interpretation', 'Graph construction', 'Statistical analysis'] },
              { title: 'Ways to Multiply and Divide', subtopics: ['Multiplication strategies', 'Division methods', 'Mental math techniques'] },
              { title: 'How Big? How Heavy?', subtopics: ['Measurement units', 'Weight and volume', 'Measurement conversions'] }
            ]
          },
          science: {
            name: 'Environmental Science',
            icon: Microscope,
            color: 'green',
            description: 'Scientific exploration and environmental understanding',
            topics: [
              { title: 'Super Senses', subtopics: ['Animal senses', 'Sensory adaptations', 'Human vs animal senses'] },
              { title: 'A Snake Charmer\'s Story', subtopics: ['Traditional occupations', 'Animal behavior', 'Cultural practices'] },
              { title: 'From Tasting to Digesting', subtopics: ['Digestive system', 'Food processing', 'Nutritional awareness'] },
              { title: 'Mangoes Round the Year', subtopics: ['Food preservation', 'Seasonal availability', 'Food processing'] },
              { title: 'Seeds and Seeds', subtopics: ['Plant reproduction', 'Seed dispersal', 'Growth patterns'] },
              { title: 'Every Drop Counts', subtopics: ['Water conservation', 'Water cycle', 'Resource management'] },
              { title: 'Experiments with Water', subtopics: ['Water properties', 'Scientific method', 'Experimentation'] },
              { title: 'A Treat for Mosquitoes', subtopics: ['Insect behavior', 'Disease prevention', 'Health awareness'] },
              { title: 'Up You Go!', subtopics: ['Climbing adaptations', 'Plant support', 'Growth strategies'] },
              { title: 'Walls Tell Stories', subtopics: ['Construction techniques', 'Building materials', 'Architectural heritage'] },
              { title: 'Sunita in Space', subtopics: ['Space exploration', 'Astronaut life', 'Scientific achievements'] },
              { title: 'What if it Finishes…?', subtopics: ['Resource depletion', 'Sustainability', 'Environmental responsibility'] },
              { title: 'A Shelter so High!', subtopics: ['Animal habitats', 'Adaptation strategies', 'Survival techniques'] },
              { title: 'When the Earth Shook!', subtopics: ['Natural disasters', 'Earthquake awareness', 'Safety measures'] },
              { title: 'Blow Hot, Blow Cold', subtopics: ['Temperature concepts', 'Weather patterns', 'Climate effects'] },
              { title: 'Who will do this Work?', subtopics: ['Occupational diversity', 'Skill recognition', 'Work dignity'] },
              { title: 'Across the Wall', subtopics: ['Boundaries and barriers', 'Social divisions', 'Unity in diversity'] },
              { title: 'No Place for Us?', subtopics: ['Habitat destruction', 'Wildlife conservation', 'Human impact'] },
              { title: 'A Seed tells a Farmer\'s Story', subtopics: ['Agricultural practices', 'Crop cycles', 'Farming challenges'] },
              { title: 'Whose Forests?', subtopics: ['Forest conservation', 'Indigenous rights', 'Environmental protection'] },
              { title: 'Like Father, Like Daughter', subtopics: ['Gender equality', 'Breaking stereotypes', 'Career choices'] },
              { title: 'On the Move Again', subtopics: ['Migration patterns', 'Seasonal movement', 'Adaptation strategies'] }
            ]
          }
        }
      },
      '6': {
        name: 'Class 6',
        age: '11-12 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Foundational concepts for higher mathematics',
            topics: [
              { title: 'Knowing Our Numbers', subtopics: ['Number system', 'Place value', 'Roman numerals', 'Number comparisons'] },
              { title: 'Whole Numbers', subtopics: ['Properties of whole numbers', 'Number line', 'Operations'] },
              { title: 'Playing With Numbers', subtopics: ['Factors and multiples', 'Prime and composite', 'Divisibility rules'] },
              { title: 'Basic Geometrical Ideas', subtopics: ['Points, lines, rays', 'Line segments', 'Angles', 'Curves'] },
              { title: 'Understanding Elementary Shapes', subtopics: ['Triangles', 'Quadrilaterals', 'Circles', 'Polygons'] },
              { title: 'Integers', subtopics: ['Positive and negative numbers', 'Number line', 'Integer operations'] },
              { title: 'Fractions', subtopics: ['Types of fractions', 'Equivalent fractions', 'Fraction operations'] },
              { title: 'Decimals', subtopics: ['Decimal representation', 'Decimal operations', 'Fraction-decimal conversion'] },
              { title: 'Data Handling', subtopics: ['Data collection', 'Bar graphs', 'Pictographs', 'Data interpretation'] },
              { title: 'Mensuration', subtopics: ['Perimeter and area', 'Area of rectangles', 'Area of squares'] },
              { title: 'Algebra', subtopics: ['Variables', 'Expressions', 'Equations', 'Patterns'] },
              { title: 'Ratio and Proportion', subtopics: ['Ratio concepts', 'Equivalent ratios', 'Proportions', 'Applications'] },
              { title: 'Symmetry', subtopics: ['Line symmetry', 'Symmetrical shapes', 'Reflection'] },
              { title: 'Practical Geometry', subtopics: ['Construction techniques', 'Circle construction', 'Angle construction'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Introduction to scientific concepts and methods',
            topics: [
              { title: 'Food: Where Does It Come From?', subtopics: ['Food sources', 'Plant and animal products', 'Food ingredients'] },
              { title: 'Components of Food', subtopics: ['Nutrients', 'Balanced diet', 'Deficiency diseases'] },
              { title: 'Fibre to Fabric', subtopics: ['Natural fibers', 'Fabric making', 'Cotton and jute'] },
              { title: 'Sorting Materials into Groups', subtopics: ['Material properties', 'Classification', 'Uses of materials'] },
              { title: 'Separation of Substances', subtopics: ['Separation methods', 'Filtration', 'Evaporation', 'Sieving'] },
              { title: 'Changes Around Us', subtopics: ['Physical changes', 'Chemical changes', 'Reversible changes'] },
              { title: 'Getting to Know Plants', subtopics: ['Plant parts', 'Functions', 'Types of plants'] },
              { title: 'Body Movements', subtopics: ['Human skeleton', 'Joints', 'Muscles', 'Animal movement'] },
              { title: 'The Living Organisms — Characteristics and Habitats', subtopics: ['Life processes', 'Habitats', 'Adaptations'] },
              { title: 'Motion and Measurement of Distances', subtopics: ['Types of motion', 'Measurement', 'Standard units'] },
              { title: 'Light, Shadows and Reflections', subtopics: ['Light sources', 'Shadow formation', 'Reflection'] },
              { title: 'Electricity and Circuits', subtopics: ['Electric circuits', 'Conductors and insulators', 'Switches'] },
              { title: 'Fun with Magnets', subtopics: ['Magnetic properties', 'Magnetic materials', 'Compass'] },
              { title: 'Water', subtopics: ['Water cycle', 'Groundwater', 'Water conservation'] },
              { title: 'Air Around Us', subtopics: ['Air composition', 'Properties of air', 'Air pollution'] },
              { title: 'Garbage In, Garbage Out', subtopics: ['Waste management', 'Recycling', 'Composting'] }
            ]
          }
        }
      },
      '7': {
        name: 'Class 7',
        age: '12-13 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematical concepts and applications',
            topics: [
              { title: 'Integers', subtopics: ['Integer properties', 'Integer operations', 'Number line applications'] },
              { title: 'Fractions and Decimals', subtopics: ['Fraction operations', 'Decimal operations', 'Mixed numbers'] },
              { title: 'Data Handling', subtopics: ['Data organization', 'Mean, median, mode', 'Probability basics'] },
              { title: 'Simple Equations', subtopics: ['Linear equations', 'Solving equations', 'Applications'] },
              { title: 'Lines and Angles', subtopics: ['Angle relationships', 'Parallel lines', 'Transversals'] },
              { title: 'The Triangle and its Properties', subtopics: ['Triangle types', 'Angle sum', 'Triangle inequality'] },
              { title: 'Comparing Quantities', subtopics: ['Ratios', 'Percentages', 'Profit and loss', 'Simple interest'] },
              { title: 'Rational Numbers', subtopics: ['Rational number operations', 'Number line representation'] },
              { title: 'Perimeter and Area', subtopics: ['Perimeter of shapes', 'Area calculations', 'Composite figures'] },
              { title: 'Algebraic Expressions', subtopics: ['Terms and factors', 'Like and unlike terms', 'Addition and subtraction'] },
              { title: 'Exponents and Powers', subtopics: ['Exponential notation', 'Laws of exponents', 'Applications'] },
              { title: 'Symmetry', subtopics: ['Line symmetry', 'Rotational symmetry', 'Symmetry in nature'] },
              { title: 'Visualising Solid Shapes', subtopics: ['3D shapes', 'Nets of solids', 'Cross-sections'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Comprehensive science covering physics, chemistry, and biology',
            topics: [
              { title: 'Nutrition in Plants', subtopics: ['Photosynthesis', 'Autotrophic nutrition', 'Heterotrophic nutrition'] },
              { title: 'Nutrition in Animals', subtopics: ['Digestive systems', 'Human digestion', 'Nutrition in different animals'] },
              { title: 'Fibre to Fabric', subtopics: ['Animal fibers', 'Silk production', 'Wool processing'] },
              { title: 'Heat', subtopics: ['Temperature and heat', 'Heat transfer', 'Thermal expansion'] },
              { title: 'Acids, Bases and Salts', subtopics: ['Acid-base properties', 'Indicators', 'Neutralization'] },
              { title: 'Physical and Chemical Changes', subtopics: ['Types of changes', 'Chemical reactions', 'Rusting'] },
              { title: 'Weather, Climate and Adaptations of Animals to Climate', subtopics: ['Weather vs climate', 'Animal adaptations', 'Migration'] },
              { title: 'Winds, Storms and Cyclones', subtopics: ['Air pressure', 'Wind formation', 'Storm safety'] },
              { title: 'Soil', subtopics: ['Soil formation', 'Soil types', 'Soil conservation'] },
              { title: 'Respiration in Organisms', subtopics: ['Breathing process', 'Cellular respiration', 'Respiration in plants'] },
              { title: 'Transportation in Animals and Plants', subtopics: ['Circulatory system', 'Transport in plants', 'Excretion'] },
              { title: 'Reproduction in Plants', subtopics: ['Sexual reproduction', 'Asexual reproduction', 'Seed dispersal'] },
              { title: 'Motion and Time', subtopics: ['Types of motion', 'Speed and time', 'Distance-time graphs'] },
              { title: 'Electric Current and its Effects', subtopics: ['Electric circuits', 'Heating effects', 'Electromagnets'] },
              { title: 'Light', subtopics: ['Light reflection', 'Spherical mirrors', 'Light refraction'] },
              { title: 'Water: A Precious Resource', subtopics: ['Water scarcity', 'Water management', 'Rainwater harvesting'] },
              { title: 'Forests: Our Lifeline', subtopics: ['Forest ecosystem', 'Deforestation', 'Conservation'] },
              { title: 'Wastewater Story', subtopics: ['Sewage treatment', 'Water pollution', 'Sanitation'] }
            ]
          }
        }
      },
      '8': {
        name: 'Class 8',
        age: '13-14 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Pre-algebra and advanced mathematical reasoning',
            topics: [
              { title: 'Rational Numbers', subtopics: ['Rational number properties', 'Operations on rationals', 'Representation'] },
              { title: 'Linear Equations in One Variable', subtopics: ['Solving linear equations', 'Applications', 'Word problems'] },
              { title: 'Understanding Quadrilaterals', subtopics: ['Quadrilateral properties', 'Parallelograms', 'Rhombus and squares'] },
              { title: 'Practical Geometry', subtopics: ['Construction of quadrilaterals', 'Unique constructions', 'Special quadrilaterals'] },
              { title: 'Data Handling', subtopics: ['Histograms', 'Circle graphs', 'Data interpretation', 'Probability'] },
              { title: 'Squares and Square Roots', subtopics: ['Perfect squares', 'Square root calculation', 'Pythagorean triplets'] },
              { title: 'Cubes and Cube Roots', subtopics: ['Perfect cubes', 'Cube root calculation', 'Cube patterns'] },
              { title: 'Comparing Quantities', subtopics: ['Percentage applications', 'Compound interest', 'Rate calculations'] },
              { title: 'Algebraic Expressions and Identities', subtopics: ['Algebraic identities', 'Factorization', 'Expression manipulation'] },
              { title: 'Visualising Solid Shapes', subtopics: ['3D visualization', 'Surface area', 'Volume calculations'] },
              { title: 'Mensuration', subtopics: ['Area of polygons', 'Surface area of solids', 'Volume of solids'] },
              { title: 'Exponents and Powers', subtopics: ['Laws of exponents', 'Standard form', 'Applications'] },
              { title: 'Direct and Inverse Proportion', subtopics: ['Proportional relationships', 'Applications', 'Variation'] },
              { title: 'Factorisation', subtopics: ['Common factors', 'Algebraic factorization', 'Identity applications'] },
              { title: 'Introduction to Graphs', subtopics: ['Coordinate geometry', 'Linear graphs', 'Graph interpretation'] },
              { title: 'Playing with Numbers', subtopics: ['Number patterns', 'Divisibility', 'Mathematical games'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Advanced science concepts with practical applications',
            topics: [
              { title: 'Crop Production and Management', subtopics: ['Agricultural practices', 'Crop variety', 'Modern farming'] },
              { title: 'Microorganisms: Friend and Foe', subtopics: ['Beneficial microorganisms', 'Harmful microorganisms', 'Food preservation'] },
              { title: 'Synthetic Fibres and Plastics', subtopics: ['Synthetic materials', 'Plastic properties', 'Environmental impact'] },
              { title: 'Materials: Metals and Non-Metals', subtopics: ['Metal properties', 'Non-metal properties', 'Uses of metals'] },
              { title: 'Coal and Petroleum', subtopics: ['Fossil fuels', 'Formation process', 'Conservation'] },
              { title: 'Combustion and Flame', subtopics: ['Combustion types', 'Flame structure', 'Fire safety'] },
              { title: 'Conservation of Plants and Animals', subtopics: ['Biodiversity', 'Endangered species', 'Conservation methods'] },
              { title: 'Cell—Structure and Functions', subtopics: ['Cell theory', 'Cell organelles', 'Cell types'] },
              { title: 'Reproduction in Animals', subtopics: ['Reproductive systems', 'Fertilization', 'Development'] },
              { title: 'Reaching the Age of Adolescence', subtopics: ['Physical changes', 'Hormones', 'Reproductive health'] },
              { title: 'Force and Pressure', subtopics: ['Types of forces', 'Pressure concepts', 'Applications'] },
              { title: 'Friction', subtopics: ['Friction types', 'Factors affecting friction', 'Applications'] },
              { title: 'Sound', subtopics: ['Sound production', 'Sound properties', 'Hearing mechanism'] },
              { title: 'Chemical Effects of Electric Current', subtopics: ['Electrolysis', 'Electroplating', 'LED applications'] },
              { title: 'Some Natural Phenomena', subtopics: ['Lightning', 'Earthquakes', 'Natural disasters'] },
              { title: 'Light', subtopics: ['Reflection laws', 'Refraction', 'Human eye', 'Vision defects'] },
              { title: 'Stars and The Solar System', subtopics: ['Celestial objects', 'Solar system', 'Constellations'] },
              { title: 'Pollution of Air and Water', subtopics: ['Pollution causes', 'Effects', 'Prevention measures'] }
            ]
          }
        }
      },
      '9': {
        name: 'Class 9',
        age: '14-15 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematical concepts and problem-solving',
            topics: [
              { title: 'Number Systems', subtopics: ['Real numbers', 'Rational and irrational numbers', 'Laws of exponents'] },
              { title: 'Polynomials', subtopics: ['Polynomial operations', 'Factorization', 'Remainder theorem'] },
              { title: 'Coordinate Geometry', subtopics: ['Cartesian plane', 'Distance formula', 'Section formula'] },
              { title: 'Linear Equations in Two Variables', subtopics: ['Graphical solutions', 'Algebraic solutions', 'Applications'] },
              { title: 'Introduction to Euclid\'s Geometry', subtopics: ['Axioms and postulates', 'Geometric proofs', 'Parallel lines'] },
              { title: 'Lines and Angles', subtopics: ['Angle relationships', 'Parallel lines and transversals', 'Angle properties'] },
              { title: 'Triangles', subtopics: ['Triangle congruence', 'Properties of triangles', 'Inequalities'] },
              { title: 'Quadrilaterals', subtopics: ['Properties of quadrilaterals', 'Parallelograms', 'Special quadrilaterals'] },
              { title: 'Areas of Parallelograms and Triangles', subtopics: ['Area calculations', 'Relationships between areas', 'Applications'] },
              { title: 'Circles', subtopics: ['Circle properties', 'Chord properties', 'Angle subtended by chord'] },
              { title: 'Constructions', subtopics: ['Basic constructions', 'Triangle constructions', 'Angle bisectors'] },
              { title: 'Heron\'s Formula', subtopics: ['Area using three sides', 'Applications', 'Semi-perimeter'] },
              { title: 'Surface Areas and Volumes', subtopics: ['3D shapes', 'Surface area calculations', 'Volume calculations'] },
              { title: 'Statistics', subtopics: ['Data collection', 'Graphical representation', 'Measures of central tendency'] },
              { title: 'Probability', subtopics: ['Basic probability', 'Experimental probability', 'Theoretical probability'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Integrated science covering physics, chemistry, and biology',
            topics: [
              { title: 'Matter in Our Surroundings', subtopics: ['States of matter', 'Change of state', 'Evaporation'] },
              { title: 'Is Matter Around Us Pure?', subtopics: ['Mixtures and compounds', 'Separation methods', 'Physical and chemical changes'] },
              { title: 'Atoms and Molecules', subtopics: ['Atomic theory', 'Molecular formulas', 'Mole concept'] },
              { title: 'Structure of the Atom', subtopics: ['Atomic models', 'Electronic configuration', 'Valency'] },
              { title: 'The Fundamental Unit of Life', subtopics: ['Cell theory', 'Cell organelles', 'Prokaryotes and eukaryotes'] },
              { title: 'Tissues', subtopics: ['Plant tissues', 'Animal tissues', 'Tissue functions'] },
              { title: 'Diversity in Living Organisms', subtopics: ['Classification', 'Five kingdom system', 'Biodiversity'] },
              { title: 'Motion', subtopics: ['Types of motion', 'Uniform and non-uniform motion', 'Acceleration'] },
              { title: 'Force and Laws of Motion', subtopics: ['Newton\'s laws', 'Momentum', 'Conservation of momentum'] },
              { title: 'Gravitation', subtopics: ['Universal gravitation', 'Free fall', 'Weight and mass'] },
              { title: 'Work and Energy', subtopics: ['Work-energy theorem', 'Kinetic and potential energy', 'Conservation of energy'] },
              { title: 'Sound', subtopics: ['Sound waves', 'Characteristics of sound', 'Reflection of sound'] },
              { title: 'Why Do We Fall Ill', subtopics: ['Health and disease', 'Infectious diseases', 'Prevention'] },
              { title: 'Natural Resources', subtopics: ['Air, water, soil', 'Biogeochemical cycles', 'Ozone depletion'] },
              { title: 'Improvement in Food Resources', subtopics: ['Crop production', 'Animal husbandry', 'Food security'] }
            ]
          }
        }
      },
      '10': {
        name: 'Class 10',
        age: '15-16 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematics preparing for higher studies',
            topics: [
              { title: 'Real Numbers', subtopics: ['Euclid\'s division algorithm', 'Fundamental theorem of arithmetic', 'Rational and irrational numbers'] },
              { title: 'Polynomials', subtopics: ['Polynomial degree', 'Zeros of polynomials', 'Relationship between zeros and coefficients'] },
              { title: 'Pair of Linear Equations in Two Variables', subtopics: ['Graphical method', 'Substitution method', 'Elimination method', 'Cross multiplication'] },
              { title: 'Quadratic Equations', subtopics: ['Quadratic formula', 'Nature of roots', 'Applications'] },
              { title: 'Arithmetic Progressions', subtopics: ['AP sequences', 'nth term', 'Sum of n terms'] },
              { title: 'Triangles', subtopics: ['Similarity of triangles', 'Areas of similar triangles', 'Pythagoras theorem'] },
              { title: 'Coordinate Geometry', subtopics: ['Distance formula', 'Section formula', 'Area of triangle'] },
              { title: 'Introduction to Trigonometry', subtopics: ['Trigonometric ratios', 'Trigonometric identities', 'Heights and distances'] },
              { title: 'Some Applications of Trigonometry', subtopics: ['Heights and distances problems', 'Angle of elevation and depression'] },
              { title: 'Circles', subtopics: ['Tangent to circle', 'Number of tangents', 'Lengths of tangents'] },
              { title: 'Constructions', subtopics: ['Division of line segment', 'Construction of tangents', 'Triangle constructions'] },
              { title: 'Areas Related to Circles', subtopics: ['Area of sectors', 'Area of segments', 'Combination of figures'] },
              { title: 'Surface Areas and Volumes', subtopics: ['Combination of solids', 'Frustum of cone', 'Volume conversions'] },
              { title: 'Statistics', subtopics: ['Mean of grouped data', 'Mode and median', 'Cumulative frequency'] },
              { title: 'Probability', subtopics: ['Classical probability', 'Elementary events', 'Complementary events'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Comprehensive science for board examinations',
            topics: [
              { title: 'Chemical Reactions and Equations', subtopics: ['Types of reactions', 'Balancing equations', 'Oxidation and reduction'] },
              { title: 'Acids, Bases and Salts', subtopics: ['Properties of acids and bases', 'pH scale', 'Common salts'] },
              { title: 'Metals and Non-metals', subtopics: ['Properties comparison', 'Extraction of metals', 'Corrosion'] },
              { title: 'Carbon and Its Compounds', subtopics: ['Organic compounds', 'Functional groups', 'Nomenclature'] },
              { title: 'Periodic Classification of Elements', subtopics: ['Modern periodic table', 'Periodic trends', 'Position of elements'] },
              { title: 'Life Processes', subtopics: ['Nutrition', 'Respiration', 'Transportation', 'Excretion'] },
              { title: 'Control and Coordination', subtopics: ['Nervous system', 'Hormones', 'Plant movements'] },
              { title: 'How do Organisms Reproduce?', subtopics: ['Sexual reproduction', 'Asexual reproduction', 'Reproductive health'] },
              { title: 'Heredity and Evolution', subtopics: ['Inheritance patterns', 'Evolution theory', 'Speciation'] },
              { title: 'Light – Reflection and Refraction', subtopics: ['Laws of reflection', 'Spherical mirrors', 'Refraction through lenses'] },
              { title: 'Human Eye and Colourful World', subtopics: ['Structure of eye', 'Defects of vision', 'Natural phenomena'] },
              { title: 'Electricity', subtopics: ['Electric current', 'Ohm\'s law', 'Electric power'] },
              { title: 'Magnetic Effects of Electric Current', subtopics: ['Magnetic field', 'Electromagnetic induction', 'Electric motor'] },
              { title: 'Sources of Energy', subtopics: ['Conventional sources', 'Alternative sources', 'Environmental consequences'] },
              { title: 'Our Environment', subtopics: ['Ecosystem', 'Food chains', 'Environmental problems'] },
              { title: 'Management of Natural Resources', subtopics: ['Forest management', 'Water harvesting', 'Fossil fuels'] }
            ]
          }
        }
      },
      '11': {
        name: 'Class 11',
        age: '16-17 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematics for higher secondary',
            topics: [
              { title: 'Sets', subtopics: ['Set operations', 'Venn diagrams', 'Types of sets'] },
              { title: 'Relations and Functions', subtopics: ['Types of relations', 'Functions and their types', 'Composite functions'] },
              { title: 'Trigonometric Functions', subtopics: ['Trigonometric ratios', 'Trigonometric equations', 'Inverse trigonometric functions'] },
              { title: 'Principle of Mathematical Induction', subtopics: ['Mathematical induction', 'Applications', 'Proof techniques'] },
              { title: 'Complex Numbers and Quadratic Equations', subtopics: ['Complex number operations', 'Argand plane', 'Quadratic equations'] },
              { title: 'Linear Inequalities', subtopics: ['Linear inequalities', 'Graphical solutions', 'System of inequalities'] },
              { title: 'Permutations and Combinations', subtopics: ['Fundamental principle', 'Permutations', 'Combinations'] },
              { title: 'Binomial Theorem', subtopics: ['Binomial expansion', 'General term', 'Applications'] },
              { title: 'Sequences and Series', subtopics: ['Arithmetic progression', 'Geometric progression', 'Special series'] },
              { title: 'Straight Lines', subtopics: ['Various forms of line', 'Angle between lines', 'Distance formulas'] },
              { title: 'Conic Sections', subtopics: ['Circle', 'Parabola', 'Ellipse', 'Hyperbola'] },
              { title: 'Introduction to Three-Dimensional Geometry', subtopics: ['Coordinate system', 'Distance formula', 'Section formula'] },
              { title: 'Limits and Derivatives', subtopics: ['Concept of limits', 'Derivatives', 'Applications'] },
              { title: 'Mathematical Reasoning', subtopics: ['Statements', 'Logical connectives', 'Proof methods'] },
              { title: 'Statistics', subtopics: ['Measures of dispersion', 'Analysis of frequency distributions'] },
              { title: 'Probability', subtopics: ['Random experiments', 'Probability of events', 'Addition theorem'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Separate streams for Physics, Chemistry, and Biology',
            subjects: {
              physics: {
                name: 'Physics',
                icon: Atom,
                color: 'red',
                description: 'Fundamental physics concepts and principles',
                topics: [
                  { title: 'Physical World', subtopics: ['Scope of physics', 'Physical quantities', 'Fundamental forces'] },
                  { title: 'Units and Measurements', subtopics: ['Systems of units', 'Dimensional analysis', 'Error analysis'] },
                  { title: 'Motion in a Straight Line', subtopics: ['Position and displacement', 'Velocity and acceleration', 'Kinematic equations'] },
                  { title: 'Motion in a Plane', subtopics: ['Vector addition', 'Projectile motion', 'Uniform circular motion'] },
                  { title: 'Laws of Motion', subtopics: ['Newton\'s laws', 'Momentum conservation', 'Friction'] },
                  { title: 'Work, Energy and Power', subtopics: ['Work-energy theorem', 'Conservation of energy', 'Power'] },
                  { title: 'System of Particles and Rotational Motion', subtopics: ['Center of mass', 'Rotational kinematics', 'Angular momentum'] },
                  { title: 'Gravitation', subtopics: ['Universal gravitation', 'Gravitational potential', 'Satellite motion'] },
                  { title: 'Mechanical Properties of Solids', subtopics: ['Stress and strain', 'Elastic moduli', 'Applications'] },
                  { title: 'Mechanical Properties of Fluids', subtopics: ['Pressure', 'Streamline flow', 'Bernoulli\'s principle'] },
                  { title: 'Thermal Properties of Matter', subtopics: ['Heat and temperature', 'Thermal expansion', 'Heat transfer'] },
                  { title: 'Thermodynamics', subtopics: ['Thermodynamic processes', 'First law', 'Heat engines'] },
                  { title: 'Kinetic Theory', subtopics: ['Molecular kinetic theory', 'Gas laws', 'Specific heat'] },
                  { title: 'Oscillations', subtopics: ['Simple harmonic motion', 'Oscillations applications', 'Resonance'] },
                  { title: 'Waves', subtopics: ['Wave properties', 'Sound waves', 'Doppler effect'] }
                ]
              },
              chemistry: {
                name: 'Chemistry',
                icon: Microscope,
                color: 'green',
                description: 'Chemical principles and reactions',
                topics: [
                  { title: 'Some Basic Concepts of Chemistry', subtopics: ['Atoms and molecules', 'Mole concept', 'Stoichiometry'] },
                  { title: 'Structure of Atom', subtopics: ['Atomic models', 'Quantum numbers', 'Electronic configuration'] },
                  { title: 'Classification of Elements and Periodicity in Properties', subtopics: ['Modern periodic law', 'Periodic trends', 'Classification'] },
                  { title: 'Chemical Bonding and Molecular Structure', subtopics: ['Ionic bonding', 'Covalent bonding', 'Molecular geometry'] },
                  { title: 'States of Matter', subtopics: ['Gas laws', 'Kinetic theory', 'Intermolecular forces'] },
                  { title: 'Thermodynamics', subtopics: ['System and surroundings', 'First law', 'Enthalpy'] },
                  { title: 'Equilibrium', subtopics: ['Chemical equilibrium', 'Le Chatelier\'s principle', 'Ionic equilibrium'] },
                  { title: 'Redox Reactions', subtopics: ['Oxidation-reduction', 'Balancing redox reactions', 'Applications'] },
                  { title: 'Hydrogen', subtopics: ['Position in periodic table', 'Properties', 'Uses'] },
                  { title: 'The s-Block Elements', subtopics: ['Alkali metals', 'Alkaline earth metals', 'Properties and uses'] },
                  { title: 'The p-Block Elements', subtopics: ['Group 13 to 18 elements', 'Properties and trends'] },
                  { title: 'Organic Chemistry: Some Basic Principles and Techniques', subtopics: ['Classification', 'Nomenclature', 'Isomerism'] },
                  { title: 'Hydrocarbons', subtopics: ['Alkanes', 'Alkenes', 'Alkynes', 'Aromatic hydrocarbons'] },
                  { title: 'Environmental Chemistry', subtopics: ['Environmental pollution', 'Atmospheric chemistry', 'Green chemistry'] }
                ]
              },
              biology: {
                name: 'Biology',
                icon: BookOpen,
                color: 'green',
                description: 'Life sciences and biological processes',
                topics: [
                  { title: 'The Living World', subtopics: ['Diversity of living organisms', 'Taxonomic categories', 'Taxonomical aids'] },
                  { title: 'Biological Classification', subtopics: ['Kingdom classification', 'Five kingdom system', 'Virus and lichens'] },
                  { title: 'Plant Kingdom', subtopics: ['Algae', 'Bryophytes', 'Gymnosperms', 'Angiosperms'] },
                  { title: 'Animal Kingdom', subtopics: ['Animal classification', 'Phylum characteristics', 'Evolutionary relationships'] },
                  { title: 'Morphology of Flowering Plants', subtopics: ['Root systems', 'Shoot system', 'Flower structure'] },
                  { title: 'Anatomy of Flowering Plants', subtopics: ['Tissue systems', 'Anatomy of root, stem, leaf'] },
                  { title: 'Structural Organisation in Animals', subtopics: ['Animal tissues', 'Organ systems', 'Morphology'] },
                  { title: 'Cell: The Unit of Life', subtopics: ['Cell theory', 'Cell structure', 'Cell organelles'] },
                  { title: 'Biomolecules', subtopics: ['Carbohydrates', 'Proteins', 'Lipids', 'Nucleic acids'] },
                  { title: 'Cell Cycle and Cell Division', subtopics: ['Cell cycle phases', 'Mitosis', 'Meiosis'] },
                  { title: 'Transport in Plants', subtopics: ['Water transport', 'Mineral transport', 'Phloem transport'] },
                  { title: 'Mineral Nutrition', subtopics: ['Essential elements', 'Deficiency symptoms', 'Nitrogen cycle'] },
                  { title: 'Photosynthesis in Higher Plants', subtopics: ['Light reactions', 'Dark reactions', 'C3 and C4 pathways'] },
                  { title: 'Respiration in Plants', subtopics: ['Glycolysis', 'Krebs cycle', 'Electron transport'] },
                  { title: 'Plant Growth and Development', subtopics: ['Growth regulators', 'Photoperiodism', 'Vernalization'] },
                  { title: 'Digestion and Absorption', subtopics: ['Digestive system', 'Digestion process', 'Absorption'] },
                  { title: 'Breathing and Exchange of Gases', subtopics: ['Respiratory organs', 'Mechanism of breathing', 'Gas transport'] },
                  { title: 'Body Fluids and Circulation', subtopics: ['Blood composition', 'Heart structure', 'Cardiac cycle'] },
                  { title: 'Excretory Products and Their Elimination', subtopics: ['Modes of excretion', 'Human excretory system', 'Kidney function'] },
                  { title: 'Locomotion and Movement', subtopics: ['Types of movement', 'Skeletal system', 'Muscle types'] },
                  { title: 'Neural Control and Coordination', subtopics: ['Nervous system', 'Neuron structure', 'Reflex action'] },
                  { title: 'Chemical Coordination and Integration', subtopics: ['Endocrine glands', 'Hormone mechanism', 'Feedback control'] }
                ]
              }
            }
          }
        }
      },
      '12': {
        name: 'Class 12',
        age: '17-18 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'Advanced mathematics for competitive exams',
            topics: [
              { title: 'Relations and Functions', subtopics: ['Types of functions', 'Composite functions', 'Invertible functions'] },
              { title: 'Inverse Trigonometric Functions', subtopics: ['Properties', 'Inverse trigonometric equations'] },
              { title: 'Matrices', subtopics: ['Matrix operations', 'Determinants', 'Applications'] },
              { title: 'Determinants', subtopics: ['Properties of determinants', 'Applications', 'System of equations'] },
              { title: 'Continuity and Differentiability', subtopics: ['Limits and continuity', 'Derivatives', 'Applications'] },
              { title: 'Application of Derivatives', subtopics: ['Rate of change', 'Tangents and normals', 'Maxima and minima'] },
              { title: 'Integrals', subtopics: ['Indefinite integrals', 'Integration methods', 'Definite integrals'] },
              { title: 'Application of Integrals', subtopics: ['Area under curves', 'Area between curves', 'Volume calculations'] },
              { title: 'Differential Equations', subtopics: ['First order equations', 'Applications', 'Linear differential equations'] },
              { title: 'Vector Algebra', subtopics: ['Vector operations', 'Scalar and vector products', 'Applications'] },
              { title: 'Three-Dimensional Geometry', subtopics: ['Direction cosines', 'Line and plane equations', 'Angle between lines'] },
              { title: 'Linear Programming', subtopics: ['Mathematical formulation', 'Graphical method', 'Optimization'] },
              { title: 'Probability', subtopics: ['Conditional probability', 'Bayes theorem', 'Random variables'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'Separate streams for Physics, Chemistry, and Biology',
            subjects: {
              physics: {
                name: 'Physics',
                icon: Atom,
                color: 'red',
                description: 'Advanced physics for competitive examinations',
                topics: [
                  { title: 'Electric Charges and Fields', subtopics: ['Coulomb\'s law', 'Electric field', 'Gauss\'s law'] },
                  { title: 'Electrostatic Potential and Capacitance', subtopics: ['Electric potential', 'Capacitors', 'Dielectrics'] },
                  { title: 'Current Electricity', subtopics: ['Ohm\'s law', 'Kirchhoff\'s laws', 'Electrical circuits'] },
                  { title: 'Moving Charges and Magnetism', subtopics: ['Magnetic force', 'Magnetic field', 'Applications'] },
                  { title: 'Magnetism and Matter', subtopics: ['Magnetic properties', 'Earth\'s magnetism', 'Magnetic materials'] },
                  { title: 'Electromagnetic Induction', subtopics: ['Faraday\'s law', 'Lenz\'s law', 'Self and mutual induction'] },
                  { title: 'Alternating Current', subtopics: ['AC circuits', 'Power in AC circuits', 'Transformers'] },
                  { title: 'Electromagnetic Waves', subtopics: ['Wave properties', 'Electromagnetic spectrum', 'Applications'] },
                  { title: 'Ray Optics and Optical Instruments', subtopics: ['Reflection and refraction', 'Lens formula', 'Optical instruments'] },
                  { title: 'Wave Optics', subtopics: ['Interference', 'Diffraction', 'Polarization'] },
                  { title: 'Dual Nature of Radiation and Matter', subtopics: ['Photoelectric effect', 'Matter waves', 'Davisson-Germer experiment'] },
                  { title: 'Atoms', subtopics: ['Atomic models', 'Bohr model', 'Line spectra'] },
                  { title: 'Nuclei', subtopics: ['Nuclear structure', 'Radioactivity', 'Nuclear reactions'] },
                  { title: 'Semiconductor Electronics: Materials, Devices and Simple Circuits', subtopics: ['Semiconductors', 'p-n junction', 'Logic gates'] },
                  { title: 'Communication Systems', subtopics: ['Communication system elements', 'Propagation', 'Modulation'] }
                ]
              },
              chemistry: {
                name: 'Chemistry',
                icon: Microscope,
                color: 'green',
                description: 'Advanced chemistry concepts',
                topics: [
                  { title: 'The Solid State', subtopics: ['Crystal lattice', 'Unit cell', 'Packing efficiency'] },
                  { title: 'Solutions', subtopics: ['Types of solutions', 'Colligative properties', 'Abnormal molecular mass'] },
                  { title: 'Electrochemistry', subtopics: ['Electrochemical cells', 'Nernst equation', 'Electrolysis'] },
                  { title: 'Chemical Kinetics', subtopics: ['Rate of reaction', 'Order and molecularity', 'Arrhenius equation'] },
                  { title: 'Surface Chemistry', subtopics: ['Adsorption', 'Colloids', 'Emulsions'] },
                  { title: 'General Principles and Processes of Isolation of Elements', subtopics: ['Metallurgy principles', 'Extraction processes'] },
                  { title: 'The p-Block Elements', subtopics: ['Group 15, 16, 17, 18 elements', 'Properties and compounds'] },
                  { title: 'The d- and f-Block Elements', subtopics: ['Transition metals', 'Lanthanides', 'Actinides'] },
                  { title: 'Coordination Compounds', subtopics: ['Coordination complexes', 'Bonding theories', 'Isomerism'] },
                  { title: 'Haloalkanes and Haloarenes', subtopics: ['Nomenclature', 'Preparation methods', 'Reactions'] },
                  { title: 'Alcohols, Phenols and Ethers', subtopics: ['Preparation and properties', 'Reactions', 'Uses'] },
                  { title: 'Aldehydes, Ketones and Carboxylic Acids', subtopics: ['Functional groups', 'Preparation', 'Chemical reactions'] },
                  { title: 'Amines', subtopics: ['Classification', 'Preparation methods', 'Properties'] },
                  { title: 'Biomolecules', subtopics: ['Carbohydrates', 'Proteins', 'Nucleic acids', 'Vitamins'] },
                  { title: 'Polymers', subtopics: ['Classification', 'Polymerization', 'Biodegradable polymers'] },
                  { title: 'Chemistry in Everyday Life', subtopics: ['Drugs and medicines', 'Food chemistry', 'Cleaning agents'] }
                ]
              },
              biology: {
                name: 'Biology',
                icon: BookOpen,
                color: 'green',
                description: 'Advanced biological concepts',
                topics: [
                  { title: 'Reproduction in Organisms', subtopics: ['Modes of reproduction', 'Sexual vs asexual', 'Life cycles'] },
                  { title: 'Sexual Reproduction in Flowering Plants', subtopics: ['Flower structure', 'Pollination', 'Fertilization'] },
                  { title: 'Human Reproduction', subtopics: ['Reproductive systems', 'Gametogenesis', 'Pregnancy'] },
                  { title: 'Reproductive Health', subtopics: ['Population control', 'Medical termination', 'STDs'] },
                  { title: 'Principles of Inheritance and Variation', subtopics: ['Mendel\'s laws', 'Chromosomal inheritance', 'Sex determination'] },
                  { title: 'Molecular Basis of Inheritance', subtopics: ['DNA structure', 'Replication', 'Transcription and translation'] },
                  { title: 'Evolution', subtopics: ['Origin of life', 'Evolution theories', 'Human evolution'] },
                  { title: 'Human Health and Diseases', subtopics: ['Pathogens', 'Immune system', 'Vaccines'] },
                  { title: 'Strategies for Enhancement in Food Production', subtopics: ['Plant breeding', 'Animal husbandry', 'Biotechnology applications'] },
                  { title: 'Microbes in Human Welfare', subtopics: ['Microbes in food production', 'Industrial products', 'Sewage treatment'] },
                  { title: 'Biotechnology: Principles and Processes', subtopics: ['Genetic engineering', 'PCR', 'Cloning vectors'] },
                  { title: 'Biotechnology and its Applications', subtopics: ['Medical applications', 'Agricultural applications', 'Environmental applications'] },
                  { title: 'Organisms and Populations', subtopics: ['Population ecology', 'Population interactions', 'Population attributes'] },
                  { title: 'Ecosystem', subtopics: ['Ecosystem structure', 'Energy flow', 'Nutrient cycling'] },
                  { title: 'Biodiversity and Conservation', subtopics: ['Biodiversity patterns', 'Conservation strategies', 'Protected areas'] },
                  { title: 'Environmental Issues', subtopics: ['Pollution types', 'Global warming', 'Ozone depletion'] }
                ]
              }
            }
          }
        }
      }
    },

    // ICSE Curriculum (Classes 2-12)
    'icse': {
      '2': {
        name: 'Class 2',
        age: '7-8 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              { title: 'Numbers (100–200, 201–999)', subtopics: ['Number recognition', 'Number writing', 'Number comparison'] },
              { title: 'Addition & Subtraction', subtopics: ['Basic operations', 'Word problems', 'Mental math'] },
              { title: 'Multiplication', subtopics: ['Tables', 'Repeated addition', 'Applications'] },
              { title: 'Geometry (basic shapes)', subtopics: ['2D shapes', '3D shapes', 'Shape properties'] },
              { title: 'Measurement', subtopics: ['Length', 'Weight', 'Time'] },
              { title: 'Time', subtopics: ['Clock reading', 'AM/PM', 'Time duration'] },
              { title: 'Data Handling', subtopics: ['Simple graphs', 'Data collection', 'Pictographs'] },
              { title: 'Patterns', subtopics: ['Number patterns', 'Shape patterns', 'Color patterns'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              { title: 'Our Body', subtopics: ['Body parts', 'Sense organs', 'Health and hygiene'] },
              { title: 'My Family', subtopics: ['Family relationships', 'Family tree', 'Responsibilities'] },
              { title: 'Food and Health', subtopics: ['Healthy foods', 'Balanced diet', 'Food sources'] },
              { title: 'Plants Around Us', subtopics: ['Plant parts', 'Plant growth', 'Plant uses'] },
              { title: 'Animals Around Us', subtopics: ['Domestic animals', 'Wild animals', 'Animal homes'] },
              { title: 'Air, Water, and Weather', subtopics: ['Properties of air and water', 'Weather changes', 'Seasons'] },
              { title: 'The Sky Above', subtopics: ['Sun, moon, stars', 'Day and night', 'Sky observations'] },
              { title: 'Good Habits', subtopics: ['Personal hygiene', 'Social habits', 'Environmental care'] },
              { title: 'Safety Rules', subtopics: ['Home safety', 'Road safety', 'Emergency procedures'] }
            ]
          }
        }
      },
      '3': {
        name: 'Class 3',
        age: '8-9 years',
        subjects: {
          mathematics:{
            name: 'Mathematics',
            icon: Calculator,
            color: 'purple',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Numbers'},
              {title: 'Number Operations'},
              {title: 'Geometry'},
              {title: 'Measurements'},
              {title: 'Data Handling'},
              {title: 'Patterns'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'teal',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Living and Non-Living Things'},
              {title: 'Parts of a Plant'},
              {title: 'Birds and Their Nests'},
              {title: 'Animals and Their Young Ones'},
              {title: 'The Human Body'},
              {title: 'Cleanliness and Good Habits'},
              {title: 'Air and Water'},
              {title: 'Rocks and Soil'},
              {title: 'Our Earth and the Sun'},
              {title: 'Safety Rules'}
            ]
          }
        }
      },
      '4': {
        name: 'Class 4',
        age: '9-10 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Numbers and Number Sense'},
              {title: 'Addition, Subtraction, Multiplication, Division'},
              {title: 'Factors and Multiples'},
              {title: 'Mixed Operations'},
              {title: 'Logical Reasoning'},
              {title: 'Data and Graphs'},
              {title: 'Patterns and Sequences'},
              {title: 'Money, Time, Units of Measurement'},
              {title: 'Fractions, Probability'},
              {title: 'Geometry & Geometry Measurement'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Plant Life'},
              {title: 'Adaptation in Plants'},
              {title: 'Animal Life'},
              {title: 'Animals: Adaptation and Classification'},
              {title: 'The Human Body: Organ Systems'},
              {title: 'Digestion and Teeth'},
              {title: 'Clothes and Fibres'},
              {title: 'Air, Water, and Weather'},
              {title: 'The Earth and Its Neighbors'},
              {title: 'Our Environment'}
            ]
          }
        }
      },
      '5': {
        name: 'Class 5',
        age: '10-11 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Numbers'},
              {title: 'Number Operations'},
              {title: 'Fractions and Decimals'},
              {title: 'Playing with Numbers (Factors & Multiples)'},
              {title: 'Introduction to Negative Numbers'},
              {title: 'Geometry'},
              {title: 'Measurement'},
              {title: 'Introduction to Percentage'},
              {title: 'Data Handling'},
              {title: 'Patterns'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Growing Plants'},
              {title: 'Food and Health'},
              {title: 'Safety and First Aid'},
              {title: 'Solids, Liquids, and Gases'},
              {title: 'Rocks and Minerals'},
              {title: 'Soil Erosion and Conservation'},
              {title: 'Air, Water, and Weather'},
              {title: 'The Moon'},
              {title: 'Our Environment'},
              {title: 'Natural Calamities'}
            ]
          }
        }
      },
      '6':{
        name: 'Class 6',  
        age: '11-12 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Number System (Natural & Integer Numbers, Fractions, Decimals)'},
              {title: 'Exponents, Squares, Cubes, Roots, Factorization, HCF, LCM'},
              {title: 'Algebra (Basic algebra, Linear equations)'},
              {title: 'Arithmetic’s (Average, Ratio & Proportion, Percentage, Time, Distance, Work, Profit & Loss)'},
              {title: 'Set Theory'},
              {title: 'Geometry, Mensuration, Statistics'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Living & Non-Living Things'},
              {title: 'The Cell'},
              {title: 'The Leaf'},
              {title: 'Flower & Fruit'},
              {title: 'Human Body: The Digestive System'},
              {title: 'Human Body: The Respiratory System'},
              {title: 'Human Body: The Excretory System'},
              {title: 'Classification of Animals'},
              {title: 'Health and Hygiene'},
              {title: 'Matter and its Composition'},
              {title: 'Physical and Chemical Changes'},
              {title: 'Elements, Compounds, and Mixtures'},
              {title: 'Air and Atmosphere'},
              {title: 'Magnetism'}
            ]
          }
        }
      },
      '7':{
        name: 'Class 7',
        age: '12-13 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Integers'},
              {title: 'Rational Numbers'},
              {title: 'Fractions'},
              {title: 'Decimals'},
              {title: 'Exponents and Powers'},
              {title: 'Sets'},
              {title: 'Ratio, Proportion & Unitary Method'},
              {title: 'Percentage, Profit & Loss, Simple Interest'},
              {title: 'Algebra'},
              {title: 'Geometry'},
              {title: 'Perimeter & Area'},
              {title: 'Data Handling, Probability'},
              {title: 'Patterns'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Plant Life: Nutrition and Excretion'},
              {title: 'Animal Life: Transport and Excretion'},
              {title: 'Human Body: Circulatory and Excretory Systems'},
              {title: 'Classification of Living Things'},
              {title: 'Soil'},
              {title: 'Health and Safety'},
              {title: 'Acids, Bases, and Salts'},
              {title: 'Elements, Compounds, and Mixtures'},
              {title: 'Physical and Chemical Changes'},
              {title: 'Heat and Temperature'}
            ]
          }
        }
      },
      '8':{
        name: 'Class 8',
        age: '13-14 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE foundational mathematics',
            topics: [
              {title: 'Rational Numbers'},
              {title: 'Exponents and Powers'},
              {title: 'Playing with Numbers'},
              {title: 'Sets'},
              {title: 'Ratio and Proportion'},
              {title: 'Algebraic Expressions, Linear Equations'},
              {title: 'Factorization'},
              {title: 'Geometry (Quadrilaterals, Polygons)'},
              {title: 'Mensuration'},
              {title: 'Data Handling, Statistics'},
              {title: 'Patterns'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE integrated science',
            topics: [
              {title: 'Human Body: The Circulatory and Excretory Systems'},
              {title: 'Reproduction in Animals and Plants'},
              {title: 'Ecosystems'},
              {title: 'Pollution'},
              {title: 'Matter'},
              {title: 'Atomic Structure'},
              {title: 'Chemical Reactions'},
              {title: 'Metals and Non-metals'},
              {title: 'Coal and Petroleum'},
              {title: 'Force and Pressure'},
              {title: 'Friction'},
              {title: 'Light'},
              {title: 'Sound'},
              {title: 'Electricity'}
            ]
          }
        }
      },
      '9': {
        name: 'Class 9',
        age: '14-15 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'purple',
            description: 'ICSE advanced mathematics',
            topics: [
              { title: 'Pure Arithmetic (Rational & Irrational Numbers)', subtopics: ['Number system', 'Operations', 'Properties'] },
              { title: 'Commercial Mathematics (Compound Interest)', subtopics: ['Simple and compound interest', 'Applications', 'Banking'] },
              { title: 'Algebra (Expansions, Factorisation, Linear Equations, Indices, Logarithms)', subtopics: ['Algebraic operations', 'Equations', 'Logarithmic calculations'] },
              { title: 'Geometry (Triangles, Rectilinear Figures, Circles)', subtopics: ['Geometric theorems', 'Constructions', 'Circle properties'] },
              { title: 'Statistics (Collection, organization, mean, median)', subtopics: ['Data handling', 'Central tendencies', 'Graphical representation'] },
              { title: 'Mensuration (Area, Perimeter, Volume)', subtopics: ['2D areas', '3D volumes', 'Surface areas'] },
              { title: 'Trigonometry (Ratios, Standard Angles, Simple 2D Problems)', subtopics: ['Trigonometric ratios', 'Applications', 'Problem solving'] },
              { title: 'Coordinate Geometry', subtopics: ['Cartesian plane', 'Distance formula', 'Linear equations'] }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'teal',
            description: 'ICSE science split into Physics, Chemistry, Biology',
            subjects: {
              physics: {
                name: 'Physics',
                icon: Atom,
                color: 'red',
                description: 'ICSE Class 9 Physics',
                topics: [
                  { title: 'Measurements and Experimentation', subtopics: ['Units and measurements', 'Experimental methods', 'Error analysis'] },
                  { title: 'Motion in One Dimension', subtopics: ['Types of motion', 'Velocity and acceleration', 'Equations of motion'] },
                  { title: 'Laws of Motion', subtopics: ['Newton\'s laws', 'Force and momentum', 'Applications'] },
                  { title: 'Fluids', subtopics: ['Pressure', 'Buoyancy', 'Archimedes principle'] },
                  { title: 'Heat and Energy', subtopics: ['Temperature and heat', 'Heat transfer', 'Thermal expansion'] },
                  { title: 'Light', subtopics: ['Reflection', 'Refraction', 'Lenses and mirrors'] },
                  { title: 'Sound', subtopics: ['Wave properties', 'Sound characteristics', 'Applications'] },
                  { title: 'Electricity and Magnetism', subtopics: ['Electric circuits', 'Current and voltage', 'Magnetic effects'] }
                ]
              },
              chemistry: {
                name: 'Chemistry',
                icon: Microscope,
                color: 'green',
                description: 'ICSE Class 9 Chemistry',
                topics: [
                  { title: 'Matter and Its Composition', subtopics: ['States of matter', 'Particle theory', 'Properties'] },
                  { title: 'Physical and Chemical Changes', subtopics: ['Types of changes', 'Chemical reactions', 'Energy changes'] },
                  { title: 'Elements, Compounds, and Mixtures', subtopics: ['Classification', 'Separation methods', 'Purity'] },
                  { title: 'The Language of Chemistry', subtopics: ['Symbols and formulas', 'Chemical equations', 'Valency'] },
                  { title: 'Chemical Changes and Reactions', subtopics: ['Types of reactions', 'Balancing equations', 'Applications'] },
                  { title: 'Water', subtopics: ['Properties of water', 'Hard and soft water', 'Water treatment'] },
                  { title: 'Atomic Structure', subtopics: ['Atomic theory', 'Subatomic particles', 'Electronic configuration'] },
                  { title: 'The Periodic Table', subtopics: ['Periodic law', 'Groups and periods', 'Properties'] },
                  { title: 'Study of the First Element – Hydrogen', subtopics: ['Properties of hydrogen', 'Preparation', 'Uses'] },
                  { title: 'Study of Gas Laws', subtopics: ['Boyle\'s law', 'Charles\'s law', 'Gas equation'] }
                ]
              },
              biology: {
                name: 'Biology',
                icon: BookOpen,
                color: 'green',
                description: 'ICSE Class 9 Biology',
                topics: [
                  { title: 'Basic Biology', subtopics: ['Life processes', 'Classification', 'Biodiversity'] },
                  { title: 'Flowering Plants', subtopics: ['Plant structure', 'Plant functions', 'Adaptations'] },
                  { title: 'Plant Physiology', subtopics: ['Photosynthesis', 'Respiration', 'Transportation'] },
                  { title: 'Diversity in Living Organisms', subtopics: ['Classification systems', 'Plant kingdom', 'Animal kingdom'] },
                  { title: 'Economic Importance of Plants', subtopics: ['Food crops', 'Cash crops', 'Medicinal plants'] },
                  { title: 'Human Anatomy and Physiology', subtopics: ['Nutrition', 'Transportation in animals', 'Respiratory system'] },
                  { title: 'Hygiene', subtopics: ['Personal hygiene', 'Community hygiene', 'Environmental hygiene'] },
                  { title: 'Diseases: Causes and Prevention', subtopics: ['Types of diseases', 'Disease prevention', 'Health measures'] }
                ]
              }
            }
          }
        }
      },
      '10':{
        name: 'Class 10',
        age: '14-15 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE advanced mathematics',
            topics: [
              { title: 'Commercial Mathematics'},
              { title: 'Algebra'},
              { title: 'Geometry'},
              { title: 'Mensuration'},
              { title: 'Trigonometry'},
              { title: 'Statistics'}
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'teal',
            description: 'ICSE science split into Physics, Chemistry, Biology',
            subjects: {
              physics: {
                name: 'Physics',
                icon: Atom,
                color: 'red',
                description: 'ICSE Class 9 Physics',
                topics: [
                  { title: 'Force, Work, Power, and Energy' },
                  { title: 'Light' },
                  { title: 'Sound' },
                  { title: 'Electricity and Magnetism' },
                  { title: 'Modern Physics (e.g., Radioactivity)' }
                ]
              },
              chemistry: {
                name: 'Chemistry',
                icon: Microscope,
                color: 'blue',
                description: 'ICSE Class 9 Chemistry',
                topics: [
                  { title: 'Periodic Table' },
                  { title: 'Chemical Bonding' },
                  { title: 'Mole Concept and Stoichiometry' },
                  { title: 'Acids, Bases, and Salts' },
                  { title: 'Analytical Chemistry' },
                  { title: 'Study of Compounds (Ammonia, Nitric Acid, Sulphuric Acid, Hydrogen Chloride)' },
                  { title: 'Organic Chemistry' },
                  { title: 'Metallurgy' }
                ]
              },
              biology: {
                name: 'Biology',
                icon: BookOpen,
                color: 'green',
                description: 'ICSE Class 9 Biology',
                topics: [
                  { title: 'Basic Biology' },
                  { title: 'Flowering Plants' },
                  { title: 'Plant Physiology' },
                  { title: 'Transpiration in Plants' },
                  { title: 'Human Anatomy and Physiology (Digestive System, Circulatory System, Excretory System, Nervous and Sense Organs, Endocrine System)' },
                  { title: 'Health and Hygiene' },
                  { title: 'Pollution'},
                  { title: 'Genetics and Evolution'},
                  { title: 'Waste Generation and Management'}
                ]
              }
            }
          }
        }
      },
      '11 & 12': {
        name: 'Class 11 & 12',
        age: '16-18 years',
        subjects: {
          mathematics: {
            name: 'Mathematics',
            icon: Calculator,
            color: 'blue',
            description: 'ICSE advanced mathematics',
            topics: [
              { title: 'Class 11: Sets, Relations, Functions' },
              { title: 'Class 11: Complex Numbers' },
              { title: 'Class 11: Quadratic Equations' },
              { title: 'Class 11: Linear Inequalities' },
              { title: 'Class 11: Permutations and Combinations' },
              { title: 'Class 11: Binomial Theorem' },
              { title: 'Class 11: Sequences and Series' },
              { title: 'Class 11: Straight Lines, Conic Sections' },
              { title: 'Class 11: Trigonometry' },
              { title: 'Class 11: Limits and Derivatives' },
              { title: 'Class 11: Mathematical Reasoning' },
              { title: 'Class 11: Statistics and Probability' },
              { title: 'Class 11: Boolean Algebra' },
              { title: 'Class 12: Relations and Functions (including inverse trigonometric functions)' },
              { title: 'Class 12: Algebra (Matrices & Determinants)' },
              { title: 'Class 12: Calculus (Continuity, Differentiation, Integrals, Differential Equations)' },
              { title: 'Class 12: Probability' },
              { title: 'Class 12(Optional): Vectors' },
              { title: 'Class 12(Optional): Three-Dimensional Geometry' },
              { title: 'Class 12(Optional): Application of Integrals' },
              { title: 'Class 12(Optional): Application of Calculus (in Economics & Commerce)' },
              { title: 'Class 12(Optional): Linear Regression' },
              { title: 'Class 12(Optional): Linear Programming' }
            ]
          },
          science: {
            name: 'Science',
            icon: Microscope,
            color: 'green',
            description: 'ICSE science split into Physics, Chemistry, Biology',
            subjects: {
              physics: {
                name: 'Physics',
                icon: Atom,
                color: 'red',
                description: 'ICSE Class 9 Physics',
                topics: [
                  { title: 'Physical World and Measurement' },
                  { title: 'Kinematics' },
                  { title: 'Laws of Motion' },
                  { title: 'Work, Energy and Power' },
                  { title: 'Motion of System of Particles and Rigid Body' },
                  { title: 'Gravitation' },
                  { title: 'Properties of Bulk Matter' },
                  { title: 'Thermodynamics' },
                  { title: 'Oscillations and Waves' },
                  { title: 'Electrostatics' },
                  { title: 'Current Electricity' },
                  { title: 'Magnetic Effects of Current & Magnetism' },
                  { title: 'Electromagnetic Induction and Alternating Currents' },
                  { title: 'Electromagnetic Waves' },
                  { title: 'Optics' },
                  { title: 'Dual Nature of Radiation and Matter' },
                  { title: 'Atoms and Nuclei' },
                  { title: 'Electronic Devices' },
                  { title: 'Communication Systems' }
                ]
              },
              chemistry: {
                name: 'Chemistry',
                icon: Microscope,
                color: 'blue',
                description: 'ICSE Class 9 Chemistry',
                topics: [
                  { title: 'Some Basic Concepts of Chemistry' },
                  { title: 'Structure of Atom' },
                  { title: 'Classification of Elements and Periodicity' },
                  { title: 'Chemical Bonding and Molecular Structure' },
                  { title: 'States of Matter: Gases and Liquids' },
                  { title: 'Thermodynamics' },
                  { title: 'Equilibrium' },
                  { title: 'Redox Reactions' },
                  { title: 'Hydrogen' },
                  { title: 'The s-, p-, d- & f-Block Elements' },
                  { title: 'Organic Chemistry: Principles and Techniques' },
                  { title: 'Hydrocarbons' },
                  { title: 'Haloalkanes and Haloarenes' },
                  { title: 'Alcohols, Phenols and Ethers' },
                  { title: 'Aldehydes, Ketones and Carboxylic Acids' },
                  { title: 'Amines' },
                  { title: 'Biomolecules' },
                  { title: 'Polymers' },
                  { title: 'Chemistry in Everyday Life' }
                ]
              },
              biology: {
                name: 'Biology',
                icon: BookOpen,
                color: 'green',
                description: 'ICSE Class 9 Biology',
                topics: [
                  { title: 'Diversity of Living Organisms' },
                  { title: 'Structural Organization in Animals and Plants' },
                  { title: 'Cell Structure and Function' },
                  { title: 'Plant & Human Physiology' },
                  { title: 'Reproduction' },
                  { title: 'Genetics and Evolution' },
                  { title: 'Biology and Human Welfare' },
                  { title: 'Biotechnology and Its Applications' },
                  { title: 'Ecology and Environment' }
                ]
              }
            }
          }
        }
      }
    },

    // IGCSE Curriculum
    'igcse': {
      'core_mathematics': {
        name: 'IGCSE Core Mathematics',
        description: 'Core Mathematics curriculum for grades C–G',
        subjects: {
          mathematics: {
            name: 'Core Mathematics',
            icon: Calculator,
            color: 'indigo',
            description: 'Fundamental mathematical concepts for IGCSE core level',
            topics: [
              { 
                title: 'Number', 
                subtopics: [
                  'Natural numbers, integers, rational and irrational numbers',
                  'Prime numbers, squares, cubes',
                  'HCF and LCM calculations',
                  'Number operations and properties'
                ] 
              },
              { 
                title: 'Algebra', 
                subtopics: [
                  'Basic algebraic expressions and manipulation',
                  'Simple linear equations',
                  'Inequalities and their solutions',
                  'Simultaneous equations (two variables)'
                ] 
              },
              { 
                title: 'Indices', 
                subtopics: [
                  'Positive indices and their applications',
                  'Zero and negative indices',
                  'Laws of indices',
                  'Scientific notation'
                ] 
              },
              { 
                title: 'Sequences', 
                subtopics: [
                  'Linear sequences and patterns',
                  'Quadratic sequences',
                  'Cubic patterns recognition',
                  'nth term formulas'
                ] 
              },
              { 
                title: 'Graphs', 
                subtopics: [
                  'Linear graphs and equations',
                  'Practical real-world graph applications',
                  'Graph interpretation and analysis',
                  'Coordinate geometry basics'
                ] 
              },
              { 
                title: 'Geometry', 
                subtopics: [
                  'Angle properties and relationships',
                  'Properties of polygons',
                  'Circle theorems and properties',
                  'Geometric constructions'
                ] 
              },
              { 
                title: 'Mensuration', 
                subtopics: [
                  'Area calculations for 2D shapes',
                  'Volume calculations for 3D shapes',
                  'Surface area computations',
                  'Composite shape calculations'
                ] 
              },
              { 
                title: 'Trigonometry', 
                subtopics: [
                  'Basic trigonometric ratios (sin, cos, tan)',
                  'Pythagoras theorem applications',
                  'Angle calculations in right triangles',
                  'Simple trigonometric problems'
                ] 
              },
              { 
                title: 'Probability and Statistics', 
                subtopics: [
                  'Basic probability concepts',
                  'Data collection and organization',
                  'Statistical representations',
                  'Mean, median, and mode'
                ] 
              }
            ]
          }
        }
      },
      'extended_mathematics': {
        name: 'IGCSE Extended Mathematics',
        description: 'Extended Mathematics curriculum for grades A–C',
        subjects: {
          mathematics: {
            name: 'Extended Mathematics',
            icon: Calculator,
            color: 'indigo',
            description: 'Advanced mathematical concepts for IGCSE extended level',
            topics: [
              { 
                title: 'Advanced Algebra', 
                subtopics: [
                  'Complex factorization techniques',
                  'Quadratic equations and their solutions',
                  'Inequalities including quadratic inequalities',
                  'Algebraic manipulation and simplification'
                ] 
              },
              { 
                title: 'Surds and Rationalization', 
                subtopics: [
                  'Surd operations and simplification',
                  'Rationalizing denominators',
                  'Mixed surd and rational number operations',
                  'Applications in geometry'
                ] 
              },
              { 
                title: 'Functions', 
                subtopics: [
                  'Domain and range determination',
                  'Function notation and evaluation',
                  'Composite functions',
                  'Inverse functions'
                ] 
              },
              { 
                title: 'Advanced Graphs', 
                subtopics: [
                  'Graphs with fractional and negative exponents',
                  'Quadratic and cubic function graphs',
                  'Graph transformations',
                  'Intersection points and solutions'
                ] 
              },
              { 
                title: 'Trigonometry', 
                subtopics: [
                  'Exact values for 30°, 45°, 60°',
                  'Trigonometric identities',
                  'Sine and cosine rules',
                  'Area of triangles using trigonometry'
                ] 
              },
              { 
                title: 'Coordinate Geometry', 
                subtopics: [
                  'Advanced coordinate geometry',
                  'Circle equations and properties',
                  'Distance and midpoint formulas',
                  'Geometric proofs using coordinates'
                ] 
              },
              { 
                title: 'Exponential and Logarithmic Functions', 
                subtopics: [
                  'Introduction to exponential functions',
                  'Basic logarithmic functions',
                  'Laws of logarithms',
                  'Applications in growth and decay'
                ] 
              }
            ]
          }
        }
      },
      'international_mathematics': {
        name: 'International Mathematics (Cambridge 0607)',
        description: 'International Mathematics curriculum',
        subjects: {
          mathematics: {
            name: 'International Mathematics',
            icon: Calculator,
            color: 'indigo',
            description: 'Cambridge International Mathematics curriculum',
            topics: [
              { 
                title: 'Number and Numerical Skills', 
                subtopics: [
                  'Number operations and properties',
                  'Percentages and ratios',
                  'Standard form and approximations'
                ] 
              },
              { 
                title: 'Algebra and Functions', 
                subtopics: [
                  'Algebraic manipulation',
                  'Quadratic functions',
                  'Exponential and logarithmic functions'
                ] 
              },
              { 
                title: 'Coordinate Geometry and Graphs', 
                subtopics: [
                  'Linear and quadratic graphs',
                  'Coordinate geometry',
                  'Graph transformations'
                ] 
              },
              { 
                title: 'Geometry and Trigonometry', 
                subtopics: [
                  'Angle properties',
                  'Trigonometric ratios and identities',
                  'Circle geometry'
                ] 
              },
              { 
                title: 'Vectors and Transformations', 
                subtopics: [
                  'Vector operations',
                  'Geometric transformations',
                  'Matrix transformations'
                ] 
              },
              { 
                title: 'Mensuration', 
                subtopics: [
                  'Area and volume calculations',
                  'Arc length and sector area',
                  'Surface area of solids'
                ] 
              },
              { 
                title: 'Probability and Statistics', 
                subtopics: [
                  'Statistical measures',
                  'Probability distributions',
                  'Data analysis'
                ] 
              },
              { 
                title: 'Use of Graphic Display Calculator', 
                subtopics: [
                  'Graphing functions',
                  'Statistical calculations',
                  'Solving equations'
                ] 
              },
              { 
                title: 'Set Theory', 
                subtopics: [
                  'Set operations',
                  'Venn diagrams',
                  'Set applications'
                ] 
              }
            ]
          }
        }
      },
      'additional_mathematics': {
        name: 'Additional Mathematics (Cambridge 0606)',
        description: 'Advanced optional mathematics course',
        subjects: {
          mathematics: {
            name: 'Additional Mathematics',
            icon: Calculator,
            color: 'indigo',
            description: 'Advanced mathematics course often taken in parallel',
            topics: [
              { 
                title: 'Functions and their Properties', 
                subtopics: [
                  'Function notation and operations',
                  'Domain and range',
                  'Composite and inverse functions'
                ] 
              },
              { 
                title: 'Quadratic Functions and Equations', 
                subtopics: [
                  'Quadratic graphs and transformations',
                  'Quadratic equations and inequalities',
                  'Applications of quadratics'
                ] 
              },
              { 
                title: 'Inequalities and Graphs', 
                subtopics: [
                  'Linear and quadratic inequalities',
                  'Graphical solutions',
                  'Systems of inequalities'
                ] 
              },
              { 
                title: 'Indices and Surds', 
                subtopics: [
                  'Laws of indices',
                  'Surd manipulation and simplification',
                  'Rationalizing denominators'
                ] 
              },
              { 
                title: 'Polynomials and Factors', 
                subtopics: [
                  'Polynomial operations',
                  'Factor and remainder theorems',
                  'Cubic and higher degree polynomials'
                ] 
              },
              { 
                title: 'Simultaneous Equations', 
                subtopics: [
                  'Linear systems',
                  'Non-linear systems',
                  'Graphical and algebraic solutions'
                ] 
              },
              { 
                title: 'Logarithmic and Exponential Functions', 
                subtopics: [
                  'Laws of logarithms',
                  'Exponential equations',
                  'Growth and decay models'
                ] 
              },
              { 
                title: 'Straight Line Graphs', 
                subtopics: [
                  'Gradient and intercepts',
                  'Parallel and perpendicular lines',
                  'Applications'
                ] 
              },
              { 
                title: 'Circular Measure and Trigonometry', 
                subtopics: [
                  'Radian measure',
                  'Trigonometric functions and identities',
                  'Trigonometric equations'
                ] 
              },
              { 
                title: 'Permutations and Combinations', 
                subtopics: [
                  'Permutation formulas',
                  'Combination calculations',
                  'Applications to probability'
                ] 
              },
              { 
                title: 'Series and Sequences', 
                subtopics: [
                  'Arithmetic and geometric progressions',
                  'Sum formulas',
                  'Applications'
                ] 
              },
              { 
                title: 'Vectors in Two Dimensions', 
                subtopics: [
                  'Vector operations',
                  'Position vectors',
                  'Applications to geometry'
                ] 
              },
              { 
                title: 'Differentiation and Integration', 
                subtopics: [
                  'Basic calculus concepts',
                  'Differentiation techniques',
                  'Elementary integration'
                ] 
              }
            ]
          }
        }
      }
    }
  };

  const handleClassSelect = (curriculum, classKey) => {
    setSelectedClass(classKey);
    setSelectedCurriculum(curriculum);
    setSelectedSubject(null);
    setExpandedTopic(null);
  };

  const handleSubjectSelect = (subjectKey) => {
    setSelectedSubject(subjectKey);
    setExpandedTopic(null);
  };

  const handleTopicExpand = (topicIndex) => {
    setExpandedTopic(expandedTopic === topicIndex ? null : topicIndex);
  };

  const renderCurriculumSection = (curriculumKey, curriculum, title) => {
    return (
      <div key={curriculumKey} className="mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-8 text-center"
        >
          <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
            {title}
          </span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(curriculum).map(([classKey, classData], index) => (
            <div
              key={classKey}
              onClick={() => handleClassSelect(curriculumKey, classKey)}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:border-red-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{classData.name}</h3>
                {classData.age && <p className="text-gray-600 text-sm mb-3">{classData.age}</p>}
                {classData.description && <p className="text-gray-600 text-xs">{classData.description}</p>}
                <div className="mt-4 text-sm text-blue-600">
                  {Object.keys(classData.subjects || {}).length} Subject{Object.keys(classData.subjects || {}).length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSubjectDetails = () => {
    if (!selectedClass || !selectedCurriculum) return null;

    const classData = syllabusData[selectedCurriculum][selectedClass];
    const subjects = classData.subjects || {};

    const renderNestedSubjects = (subjectData, parentKey = '') => {
      if (subjectData.subjects) {
        // This is a nested subject structure (like Class 11/12 Science)
        return (
          <div>
            <button
              onClick={() => setSelectedSubject(null)}
              className="mb-6 text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              ← Back to Subjects
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {subjectData.name}
              </h3>
              <p className="text-gray-600">{subjectData.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(subjectData.subjects).map(([nestedKey, nestedSubject], index) => (
                <motion.div
                  key={nestedKey}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedSubject(`${parentKey}_${nestedKey}`)}
                  className={`bg-gradient-to-br from-${nestedSubject.color}-50 to-${nestedSubject.color}-100 p-6 rounded-xl border border-${nestedSubject.color}-200 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br from-${nestedSubject.color}-200 to-${nestedSubject.color}-300 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <nestedSubject.icon className={`w-8 h-8 text-${nestedSubject.color}-600`} />
                    </div>
                    <h3 className={`text-xl font-bold text-${nestedSubject.color}-800 mb-3`}>{nestedSubject.name}</h3>
                    <p className="text-gray-700 text-sm mb-4">{nestedSubject.description}</p>
                    <div className={`text-sm text-${nestedSubject.color}-600 font-medium`}>
                      {nestedSubject.topics.length} Topics
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      } else {
        // Regular subject with topics
        return (
          <div>
            <button
              onClick={() => {
                if (selectedSubject.includes('_')) {
                  const parentKey = selectedSubject.split('_')[0];
                  setSelectedSubject(parentKey);
                } else {
                  setSelectedSubject(null);
                }
              }}
              className="mb-6 text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              ← Back
            </button>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {subjectData.name}
              </h3>
              <p className="text-gray-600">{subjectData.description}</p>
            </div>

            <div className="space-y-4">
              {subjectData.topics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                  </div>
                  
                  {/* Subtopics hidden as per user request */}
                </motion.div>
              ))}
            </div>
          </div>
        );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => {
          setSelectedClass(null);
          setSelectedCurriculum(null);
          setSelectedSubject(null);
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{classData.name}</h2>
                <p className="text-gray-600">{classData.description || 'Comprehensive curriculum coverage'}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedClass(null);
                  setSelectedCurriculum(null);
                  setSelectedSubject(null);
                }}
                className="text-gray-500 hover:text-gray-700 p-2 text-2xl"
              >
                ×
              </button>
            </div>

            {!selectedSubject ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(subjects).map(([subjectKey, subject], index) => (
                  <motion.div
                    key={subjectKey}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubjectSelect(subjectKey)}
                    className={`bg-gradient-to-br from-${subject.color}-50 to-${subject.color}-100 p-6 rounded-xl border border-${subject.color}-200 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${subject.color}-200 to-${subject.color}-300 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <subject.icon className={`w-8 h-8 text-${subject.color}-600`} />
                      </div>
                      <h3 className={`text-xl font-bold text-${subject.color}-800 mb-3`}>{subject.name}</h3>
                      <p className="text-gray-700 text-sm mb-4">{subject.description}</p>
                      <div className={`text-sm text-${subject.color}-600 font-medium`}>
                        {subject.subjects ? `${Object.keys(subject.subjects).length} Subjects` : `${subject.topics?.length || 0} Topics`}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              (() => {
                if (selectedSubject.includes('_')) {
                  const [parentKey, nestedKey] = selectedSubject.split('_');
                  const parentSubject = subjects[parentKey];
                  const nestedSubject = parentSubject.subjects[nestedKey];
                  return renderNestedSubjects(nestedSubject, parentKey);
                } else {
                  const subject = subjects[selectedSubject];
                  return renderNestedSubjects(subject, selectedSubject);
                }
              })()
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-300 via-white to-blue-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 to-blue-600/5"></div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-gray-900"
          >
            Academic <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Excellence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700"
          >
            Comprehensive curriculum coverage for NCERT, ICSE, and IGCSE boards. 
            Explore detailed syllabuses designed for academic success.
          </motion.p>
        </div>
      </section>

      {/* Curriculum Sections */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          {/* NCERT Curriculum */}
          {renderCurriculumSection('ncert', syllabusData.ncert, 'NCERT Curriculum (Classes 2-12)')}
          
          {/* ICSE Curriculum */}
          {renderCurriculumSection('icse', syllabusData.icse, 'ICSE Curriculum (Classes 2-12)')}
          
          {/* IGCSE Curriculum */}
          {renderCurriculumSection('igcse', syllabusData.igcse, 'IGCSE Curriculum')}
        </div>
      </section>

      {/* Subject Details Modal */}
      {selectedClass && renderSubjectDetails()}

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Our <span className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">Academic Program?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach ensures students excel across different curricula
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Comprehensive Coverage",
                description: "Complete syllabus coverage for NCERT, ICSE, and IGCSE curricula with detailed topic breakdowns.",
                color: "blue"
              },
              {
                icon: Users,
                title: "Expert Faculty",
                description: "Experienced teachers specialized in different curricula to provide targeted instruction.",
                color: "green"
              },
              {
                icon: GraduationCap,
                title: "Flexible Learning",
                description: "Adaptive teaching methods that cater to different learning styles and curriculum requirements.",
                color: "purple"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 rounded-full flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
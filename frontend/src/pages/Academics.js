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
    // Classes 2-8 Regular/NCERT Curriculum
    'regular': {
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
      }
    },
    
    // IGCSE Curriculum
    'igcse': {
      'core_math': {
        name: 'IGCSE Core Mathematics',
        description: 'Core Mathematics curriculum for grades C–G',
        subjects: {
          mathematics: {
            name: 'Core Mathematics',
            icon: Calculator,
            color: 'purple',
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
      'extended_math': {
        name: 'IGCSE Extended Mathematics',
        description: 'Extended Mathematics curriculum for grades A–C',
        subjects: {
          mathematics: {
            name: 'Extended Mathematics',
            icon: Calculator,
            color: 'purple',
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
      }
    },
    
    // ICSE Classes 11 & 12 Science Streams
    'icse_senior': {
      '11': {
        name: 'Class 11 (ICSE)',
        age: '16-17 years',
        subjects: {
          physics: {
            name: 'Physics',
            icon: Atom,
            color: 'red',
            description: 'Fundamental physics concepts and principles',
            topics: [
              { title: 'Physical World and Measurement', subtopics: ['Units and dimensions', 'Error analysis', 'Significant figures'] },
              { title: 'Kinematics', subtopics: ['Motion in one dimension', 'Motion in two dimensions', 'Projectile motion'] },
              { title: 'Laws of Motion', subtopics: ['Newton\'s laws', 'Force and momentum', 'Impulse'] },
              { title: 'Work, Energy and Power', subtopics: ['Work-energy theorem', 'Conservation of energy', 'Power calculations'] },
              { title: 'Motion of System of Particles and Rigid Body', subtopics: ['Center of mass', 'Rotational motion', 'Angular momentum'] },
              { title: 'Gravitation', subtopics: ['Universal gravitation', 'Gravitational field', 'Satellites'] },
              { title: 'Properties of Bulk Matter', subtopics: ['Elasticity', 'Surface tension', 'Viscosity'] },
              { title: 'Thermodynamics', subtopics: ['Laws of thermodynamics', 'Heat engines', 'Entropy'] },
              { title: 'Oscillations and Waves', subtopics: ['Simple harmonic motion', 'Wave properties', 'Sound waves'] }
            ]
          },
          chemistry: {
            name: 'Chemistry',
            icon: Microscope,
            color: 'green',
            description: 'Chemical principles and reactions',
            topics: [
              { title: 'Some Basic Concepts of Chemistry', subtopics: ['Atomic mass', 'Molecular mass', 'Mole concept'] },
              { title: 'Structure of Atom', subtopics: ['Atomic models', 'Electronic configuration', 'Quantum numbers'] },
              { title: 'Classification of Elements and Periodicity', subtopics: ['Periodic table', 'Periodic trends', 'Chemical bonding'] },
              { title: 'Chemical Bonding and Molecular Structure', subtopics: ['Ionic bonding', 'Covalent bonding', 'VSEPR theory'] },
              { title: 'States of Matter', subtopics: ['Gas laws', 'Kinetic theory', 'Liquids and solids'] },
              { title: 'Thermodynamics', subtopics: ['First law', 'Enthalpy', 'Spontaneity'] },
              { title: 'Equilibrium', subtopics: ['Chemical equilibrium', 'Ionic equilibrium', 'pH and buffers'] },
              { title: 'Redox Reactions', subtopics: ['Oxidation-reduction', 'Balancing equations', 'Electrochemical series'] },
              { title: 'Organic Chemistry Basics', subtopics: ['Nomenclature', 'Isomerism', 'Reaction mechanisms'] }
            ]
          },
          biology: {
            name: 'Biology',
            icon: BookOpen,
            color: 'green',
            description: 'Life sciences and biological processes',
            topics: [
              { title: 'Diversity of Living Organisms', subtopics: ['Classification systems', 'Taxonomy', 'Biodiversity'] },
              { title: 'Structural Organization', subtopics: ['Cell theory', 'Plant anatomy', 'Animal tissues'] },
              { title: 'Cell Structure and Function', subtopics: ['Cell organelles', 'Cell membrane', 'Cell division'] },
              { title: 'Plant Physiology', subtopics: ['Photosynthesis', 'Respiration', 'Transportation'] },
              { title: 'Human Physiology', subtopics: ['Digestive system', 'Respiratory system', 'Circulatory system'] },
              { title: 'Reproduction', subtopics: ['Sexual reproduction', 'Asexual reproduction', 'Human reproduction'] },
              { title: 'Genetics and Evolution', subtopics: ['Mendel\'s laws', 'DNA structure', 'Evolution theory'] }
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
            <motion.div
              key={classKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderSubjectDetails = () => {
    if (!selectedClass || !selectedCurriculum) return null;

    const classData = syllabusData[selectedCurriculum][selectedClass];
    const subjects = classData.subjects || {};

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
                className="text-gray-500 hover:text-gray-700 p-2"
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
                        {subject.topics.length} Topics
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="mb-6 text-red-600 hover:text-red-700 flex items-center gap-2"
                >
                  ← Back to Subjects
                </button>
                
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {subjects[selectedSubject].name}
                  </h3>
                  <p className="text-gray-600">{subjects[selectedSubject].description}</p>
                </div>

                <div className="space-y-4">
                  {subjects[selectedSubject].topics.map((topic, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div
                        onClick={() => handleTopicExpand(index)}
                        className="p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
                      >
                        <h4 className="font-semibold text-gray-900">{topic.title}</h4>
                        <ChevronRight 
                          className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedTopic === index ? 'rotate-90' : ''}`}
                        />
                      </div>
                      
                      <AnimatePresence>
                        {expandedTopic === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white border-t border-gray-200"
                          >
                            <div className="p-4">
                              <ul className="space-y-2">
                                {topic.subtopics.map((subtopic, subIndex) => (
                                  <li key={subIndex} className="flex items-start gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                                    <span className="text-gray-700">{subtopic}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-red-50 via-white to-blue-50 overflow-hidden">
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
            Comprehensive curriculum coverage for NCERT, IGCSE, and ICSE boards. 
            Explore detailed syllabuses designed for academic success.
          </motion.p>
        </div>
      </section>

      {/* Curriculum Sections */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4">
          {/* Regular/NCERT Curriculum */}
          {renderCurriculumSection('regular', syllabusData.regular, 'NCERT Curriculum (Classes 2-8)')}
          
          {/* IGCSE Curriculum */}
          {renderCurriculumSection('igcse', syllabusData.igcse, 'IGCSE Curriculum')}
          
          {/* ICSE Senior Curriculum */}
          {renderCurriculumSection('icse_senior', syllabusData.icse_senior, 'ICSE Senior Secondary (Classes 11-12)')}
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
                description: "Complete syllabus coverage for NCERT, IGCSE, and ICSE curricula with detailed topic breakdowns.",
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
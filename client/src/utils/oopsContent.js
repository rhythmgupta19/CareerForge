export const getOopsCheckpointContent = (checkpointId, lang = 'cpp') => {
  const language = (lang || 'cpp').toLowerCase() === 'js' ? 'javascript' : (lang || 'cpp').toLowerCase();

  const checkpoints = {
    oops_cp1: {
      title: 'Classes and Objects',
      subtitle: 'Implement a basic class with properties, private fields, getters, setters, and constructors.',
      videoEmbedUrl: 'https://www.youtube.com/embed/BS9nCj391r8?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Design Car Class',
          desc: 'Create a class `Car` with private members `brand` (string) and `speed` (int). Implement a constructor `Car(string b, int s)`, and getters/setters `getBrand()`, `getSpeed()`, `setSpeed(int s)`. Testing method `testCar` must return `brand` and `speed` formatted as "brand: speed".',
          functionName: 'testCar',
          constraints: 'Speed >= 0',
          testCases: [
            { input: '', expected: 'Tesla: 100' }
          ],
          hints: ['Use private access modifier.', 'Make getters public.'],
          bp: '#include <string>\nusing namespace std;\n\nclass Car {\n    // Implement brand and speed with getters/setters\n};\n\nstring testCar() {\n    // Return "Tesla: 100" by creating Car("Tesla", 100)\n    return "";\n}',
          sol: '#include <string>\nusing namespace std;\n\nclass Car {\nprivate:\n    string brand;\n    int speed;\npublic:\n    Car(string b, int s) : brand(b), speed(s) {}\n    string getBrand() { return brand; }\n    int getSpeed() { return speed; }\n    void setSpeed(int s) { speed = s; }\n};\n\nstring testCar() {\n    Car c("Tesla", 100);\n    return c.getBrand() + ": " + to_string(c.getSpeed());\n}'
        },
        java: {
          title: 'Design Car Class',
          desc: 'Create a class `Car` with private members `brand` and `speed`. Implement constructor and getters/setters.',
          functionName: 'testCar',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Tesla: 100' }],
          hints: [],
          bp: 'public class Solution {\n    public static String testCar() {\n        return "";\n    }\n}',
          sol: 'class Car {\n    private String brand;\n    private int speed;\n    public Car(String b, int s) { this.brand = b; this.speed = s; }\n    public String getBrand() { return brand; }\n    public int getSpeed() { return speed; }\n}\npublic class Solution {\n    public static String testCar() {\n        Car c = new Car("Tesla", 100);\n        return c.getBrand() + ": " + c.getSpeed();\n    }\n}'
        },
        python: {
          title: 'Design Car Class',
          desc: 'Create a class `Car` with private attributes `brand` and `speed`. Implement constructor and methods.',
          functionName: 'testCar',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Tesla: 100' }],
          hints: [],
          bp: 'def testCar() -> str:\n    return ""',
          sol: 'class Car:\n    def __init__(self, brand, speed):\n        self.__brand = brand\n        self.__speed = speed\n    def get_brand(self): return self.__brand\n    def get_speed(self): return self.__speed\ndef testCar():\n    c = Car("Tesla", 100)\n    return f"{c.get_brand()}: {c.get_speed()}"'
        },
        javascript: {
          title: 'Design Car Class',
          desc: 'Create a class `Car` with constructor and getters/setters.',
          functionName: 'testCar',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Tesla: 100' }],
          hints: [],
          bp: 'function testCar() {\n    return "";\n}',
          sol: 'class Car {\n    constructor(brand, speed) {\n        this.brand = brand;\n        this.speed = speed;\n    }\n}\nfunction testCar() {\n    const c = new Car("Tesla", 100);\n    return c.brand + ": " + c.speed;\n}'
        }
      }
    },
    oops_cp2: {
      title: 'Inheritance and Polymorphism',
      subtitle: 'Implement base and derived classes, and demonstrate compile-time and run-time polymorphism.',
      videoEmbedUrl: 'https://www.youtube.com/embed/V1P9wX8sZ0Q?rel=0&modestbranding=1',
      challenges: {
        cpp: {
          title: 'Vehicle Inheritance',
          desc: 'Create a base class `Vehicle` with virtual function `getType()` returning "Generic". Create a subclass `Bike` inheriting from `Vehicle` and overriding `getType()` to return "Bike".',
          functionName: 'testInheritance',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Bike' }],
          hints: ['Use virtual keyword in base class.', 'Inherit using public keyword.'],
          bp: '#include <string>\nusing namespace std;\n\nclass Vehicle {\n};\n\nclass Bike : public Vehicle {\n};\n\nstring testInheritance() {\n    return "";\n}',
          sol: '#include <string>\nusing namespace std;\n\nclass Vehicle {\npublic:\n    virtual string getType() { return "Generic"; }\n};\n\nclass Bike : public Vehicle {\npublic:\n    string getType() override { return "Bike"; }\n};\n\nstring testInheritance() {\n    Vehicle* v = new Bike();\n    string result = v->getType();\n    delete v;\n    return result;\n}'
        },
        java: {
          title: 'Vehicle Inheritance',
          desc: 'Create Vehicle class and subclass Bike.',
          functionName: 'testInheritance',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Bike' }],
          hints: [],
          bp: 'public class Solution {\n    public static String testInheritance() {\n        return "";\n    }\n}',
          sol: 'class Vehicle { public String getType() { return "Generic"; } }\nclass Bike extends Vehicle { public String getType() { return "Bike"; } }\npublic class Solution {\n    public static String testInheritance() {\n        Vehicle v = new Bike();\n        return v.getType();\n    }\n}'
        },
        python: {
          title: 'Vehicle Inheritance',
          desc: 'Create Vehicle class and subclass Bike.',
          functionName: 'testInheritance',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Bike' }],
          hints: [],
          bp: 'def testInheritance() -> str:\n    return ""',
          sol: 'class Vehicle:\n    def get_type(self): return "Generic"\nclass Bike(Vehicle):\n    def get_type(self): return "Bike"\ndef testInheritance():\n    v = Bike()\n    return v.get_type()'
        },
        javascript: {
          title: 'Vehicle Inheritance',
          desc: 'Create Vehicle and subclass Bike.',
          functionName: 'testInheritance',
          constraints: 'None',
          testCases: [{ input: '', expected: 'Bike' }],
          hints: [],
          bp: 'function testInheritance() {\n    return "";\n}',
          sol: 'class Vehicle { getType() { return "Generic"; } }\nclass Bike extends Vehicle { getType() { return "Bike"; } }\nfunction testInheritance() {\n    const v = new Bike();\n    return v.getType();\n}'
        }
      }
    }
  };

  const cp = checkpoints[checkpointId];
  if (!cp) return null;

  const langChallenge = cp.challenges[language] || cp.challenges.cpp;
  const isLastCheckpoint = checkpointId === 'oops_cp2';

  return {
    title: cp.title,
    subtitle: cp.subtitle,
    videoEmbedUrl: cp.videoEmbedUrl,
    challengeTitle: langChallenge.title,
    challengeDescription: langChallenge.desc,
    approach: langChallenge.approach || '',
    code: langChallenge.sol || '',
    editorBoilerplate: langChallenge.bp || '',
    testCases: langChallenge.testCases,
    functionName: langChallenge.functionName,
    hints: langChallenge.hints,
    constraints: langChallenge.constraints,
    hasVideo: true,
    isLastCheckpoint
  };
};

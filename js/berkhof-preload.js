/* Berkhof preloader.
   Adds Louis Berkhof's Systematic Theology as a structured book before app.js renders. */
(function () {
  function loadJson(path, fallback) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", path, false);
      xhr.send(null);
      if (xhr.status >= 200 && xhr.status < 300) return JSON.parse(xhr.responseText);
    } catch (error) {
      console.warn(path + " was not preloaded.", error);
    }
    return fallback;
  }

  var chapterProfiles = {
    "I.1": {summary:"신학이 추상 학문이 아니라 하나님 앞에서 사는 종교적 삶의 반성이라는 점을 정리합니다.",detail:"이 장은 종교와 신학의 관계를 벌코프 전체 구조의 출발점으로 둡니다. 신학은 신앙과 분리된 독립 지식이 아니라, 계시를 받은 공동체가 자신의 신앙 내용을 질서 있게 고백하고 이해하는 작업입니다.",subtopics:["종교와 신학","계시와 신앙","교의학의 출발점","신앙 공동체의 지식"],keyPoints:["신학의 종교적 성격","계시 의존성","교회적 지식","조직신학의 출발점"],concepts:["종교","신학","계시","교의학"]},
    "I.2": {summary:"교의가 단순한 의견이 아니라 교회가 권위 있게 고백하는 신앙 명제임을 설명합니다.",detail:"이 장은 교의학의 원리와 권위를 다룹니다. 교의는 개인의 사적 해석이 아니라 성경 계시를 교회가 역사 속에서 고백해 온 정리된 신앙 내용입니다.",subtopics:["교의의 정의","교의의 권위","교회와 고백","교의학의 원리"],keyPoints:["교의의 공적 성격","성경적 근거","교회적 고백","조직적 정리"],concepts:["교의","권위","고백","교의학"]},
    "I.3": {summary:"계시와 성경, 영감의 관계를 정리하며 조직신학의 인식 근거를 세웁니다.",detail:"이 장은 하나님 지식이 인간의 추론에서 출발하지 않고 하나님의 자기 계시에서 출발한다는 점을 보여 줍니다. 성경은 교의학의 자료 창고가 아니라, 교회가 하나님을 바르게 아는 규범적 원천입니다.",subtopics:["일반 계시","특별 계시","성경의 영감","성경의 규범성"],keyPoints:["계시 중심","성경의 권위","영감과 기록","신학의 인식 원리"],concepts:["계시","성경","영감","성경론"]},
    "I.4": {summary:"조직신학이 개별 교리를 전체 교리 체계 안에서 배열하고 해명하는 작업임을 설명합니다.",detail:"이 장은 조직신학의 방법과 과제를 정리합니다. 벌코프의 강점은 교리들을 단편적으로 나열하지 않고, 성경 계시와 교회 고백의 전체 구조 안에서 서로의 관계를 보여 주는 데 있습니다.",subtopics:["조직신학의 대상","교리의 배열","교리 간 관계","교육용 체계화"],keyPoints:["체계적 배열","교리 간 연결","교육적 명료성","개혁파 표준 구조"],concepts:["조직신학","방법론","교리 체계","신학 교육"]},
    "II.1": {summary:"신론의 출발점으로 하나님의 존재와 하나님을 아는 지식의 가능성을 다룹니다.",detail:"이 장은 하나님이 이해될 수 없는 분이면서도 참으로 알려질 수 있는 분이라는 개혁파 신론의 균형을 제시합니다. 하나님의 불가해성과 참된 인식 가능성을 함께 붙들며 신론을 시작합니다.",subtopics:["하나님의 존재","하나님 지식","불가해성","계시된 지식"],keyPoints:["신론의 출발점","하나님 인식","불가해성과 계시","구원에 필요한 지식"],concepts:["신론","하나님 지식","불가해성","계시"]},
    "II.2": {summary:"하나님의 이름과 속성을 통해 하나님이 자신을 어떻게 계시하시는지 설명합니다.",detail:"이 장은 하나님의 이름을 단순한 호칭이 아니라 자기 계시의 방식으로 이해합니다. 하나님의 속성은 하나님께 덧붙은 성질이 아니라 하나님 존재 자체가 피조물에게 알려지는 방식입니다.",subtopics:["하나님의 이름","공유적 속성","비공유적 속성","하나님의 완전성"],keyPoints:["이름과 계시","속성의 체계","하나님의 단순성","창조주와 피조물의 구별"],concepts:["하나님의 이름","속성","신론","하나님의 완전성"]},
    "II.3": {summary:"삼위일체 교리를 성경적 계시와 교회 고백의 중심 교리로 정리합니다.",detail:"이 장은 하나님이 한 본질 안에 세 위격으로 계신다는 고전적 삼위일체론을 다룹니다. 삼위일체를 사변적 난제가 아니라 기독교 하나님 이해의 핵심 구조로 제시합니다.",subtopics:["한 본질","세 위격","성부·성자·성령","삼위일체의 신비"],keyPoints:["고전적 삼위일체","본질과 위격","성경적 근거","교회 고백"],concepts:["삼위일체","본질","위격","성부 성자 성령"]},
    "II.4": {summary:"하나님의 영원한 작정과 예정, 그리고 피조 세계에 대한 하나님의 주권을 정리합니다.",detail:"이 장은 하나님의 작정을 우연적 사후 조정이 아니라 영원한 뜻의 표현으로 설명합니다. 작정 교리는 하나님의 지혜와 주권, 역사 전체의 목적과 연결됩니다.",subtopics:["하나님의 작정","예정","주권","역사의 목적"],keyPoints:["영원한 작정","하나님의 주권","예정론","섭리와의 연결"],concepts:["작정","예정","주권","하나님의 뜻"]},
    "II.5": {summary:"창조를 하나님의 자유로운 행위이자 모든 계시와 인간 삶의 기초로 설명합니다.",detail:"이 장은 세계가 우연히 생겨난 것이 아니라 하나님의 말씀과 뜻으로 창조되었다는 교리를 다룹니다. 창조론은 신론과 인간론을 잇는 다리이며, 하나님과 피조물의 구별을 분명히 세웁니다.",subtopics:["무로부터의 창조","창조의 목적","창조 질서","피조물의 의존성"],keyPoints:["창조주 하나님","무로부터의 창조","창조와 계시","피조물의 선함"],concepts:["창조론","창조주","피조물","창조 질서"]},
    "II.6": {summary:"하나님이 창조 세계를 보존하고 통치하며 목적을 향해 이끄시는 섭리를 다룹니다.",detail:"이 장은 창조 이후 세계가 자율적으로 방치되지 않는다는 점을 강조합니다. 섭리론은 보존, 협력, 통치를 통해 하나님 주권과 피조 세계의 실제 활동을 함께 설명합니다.",subtopics:["보존","협력","통치","하나님의 목적"],keyPoints:["섭리의 성경성","보존과 통치","하나님 주권","역사와 목적"],concepts:["섭리","보존","통치","하나님 주권"]},
    "III.1": {summary:"인간의 기원과 하나님의 형상을 통해 인간론의 신학적 위치를 정리합니다.",detail:"이 장은 인간을 단순한 생물학적 존재가 아니라 하나님 앞에서 창조된 인격적 피조물로 봅니다. 하나님의 형상은 인간의 존엄, 사명, 하나님과의 관계를 이해하는 핵심 열쇠입니다.",subtopics:["인간의 창조","하나님의 형상","인간의 존엄","창조의 면류관"],keyPoints:["인간론의 위치","하나님의 형상","인간의 목적","피조물의 책임"],concepts:["인간론","하나님의 형상","창조","인간의 존엄"]},
    "III.2": {summary:"인간의 구성과 원상태를 다루며 몸과 영혼의 관계를 설명합니다.",detail:"이 장은 인간을 분열된 존재가 아니라 통전적 인격으로 이해합니다. 몸과 영혼의 구별은 인정하되, 인간의 삶 전체가 하나님 앞에서 책임 있는 피조적 삶이라는 점을 강조합니다.",subtopics:["몸과 영혼","인간의 통일성","원상태","피조적 책임"],keyPoints:["몸과 영혼","인격적 통일성","창조 상태","하나님 앞의 인간"],concepts:["인간의 구성","영혼","몸","인격"]},
    "III.3": {summary:"행위언약을 통해 창조된 인간에게 주어진 순종의 질서와 언약적 책임을 다룹니다.",detail:"이 장은 타락 이전 인간이 하나님과 언약적 관계 안에 있었다는 개혁파 교리를 정리합니다. 행위언약은 인간의 순종, 생명 약속, 타락 이해의 전제를 제공합니다.",subtopics:["행위언약","순종의 요구","생명 약속","언약적 책임"],keyPoints:["언약 구조","순종과 생명","타락의 전제","개혁파 인간론"],concepts:["행위언약","언약","순종","타락 이전 상태"]},
    "III.4": {summary:"죄의 기원과 본질을 다루며 죄를 하나님과의 관계 파괴로 설명합니다.",detail:"이 장은 죄를 단순한 결핍이나 실수로 보지 않고 하나님께 대한 반역과 왜곡으로 이해합니다. 죄의 보편성과 심각성을 인간 경험과 성경 증언 안에서 함께 정리합니다.",subtopics:["죄의 기원","죄의 본질","하나님께 대한 반역","죄의 보편성"],keyPoints:["죄의 실재","하나님과의 단절","보편적 죄성","도덕적 책임"],concepts:["죄론","타락","반역","보편적 죄"]},
    "III.5": {summary:"원죄와 전가를 통해 아담의 죄와 인류의 죄악된 상태를 설명합니다.",detail:"이 장은 죄가 단지 개인의 반복 행위가 아니라 인류 전체의 상태와 관련되어 있음을 다룹니다. 원죄와 전가 교리는 구속의 필요성과 그리스도의 대표성 이해를 준비합니다.",subtopics:["원죄","죄의 전가","아담의 대표성","죄악된 상태"],keyPoints:["아담 안의 인류","죄책과 부패","전가 교리","구속 필요성"],concepts:["원죄","전가","아담","대표성"]},
    "III.6": {summary:"죄의 결과로서 죽음, 부패, 관계의 왜곡을 정리합니다.",detail:"이 장은 죄가 인간의 내면만이 아니라 하나님, 이웃, 세계와의 관계 전체를 어지럽힌다는 점을 보여 줍니다. 죄의 결과는 구원론에서 회복되어야 할 현실을 규정합니다.",subtopics:["영적 죽음","육체적 죽음","관계의 왜곡","심판"],keyPoints:["죽음의 현실","전인적 부패","관계 파괴","구원의 필요"],concepts:["죄의 결과","죽음","부패","심판"]},
    "IV.1": {summary:"그리스도의 이름과 본성을 통해 기독론의 기본 질문을 세웁니다.",detail:"이 장은 예수, 그리스도, 주라는 이름들이 그분의 인격과 사역을 어떻게 드러내는지 설명합니다. 기독론은 인간론 이후에 배치되어 타락한 인간에게 필요한 중보자를 밝힙니다.",subtopics:["예수","그리스도","주","중보자의 필요"],keyPoints:["기독론의 위치","그리스도의 이름","중보자","구속의 중심"],concepts:["기독론","예수","그리스도","주"]},
    "IV.2": {summary:"그리스도의 한 위격 안에 신성과 인성이 연합되어 있음을 정리합니다.",detail:"이 장은 성육신과 두 본성 교리를 다룹니다. 그리스도가 참 하나님이자 참 사람이라는 고전적 정통 기독론을 교회 고백의 중심으로 제시합니다.",subtopics:["성육신","두 본성","한 위격","참 하나님 참 사람"],keyPoints:["위격적 연합","신성과 인성","성육신의 신비","정통 기독론"],concepts:["성육신","두 본성","위격적 연합","기독론"]},
    "IV.3": {summary:"그리스도의 비하와 승귀라는 두 신분을 통해 구속 사역의 흐름을 설명합니다.",detail:"이 장은 성육신, 고난, 죽음으로 이어지는 비하와 부활, 승천, 하나님 우편 앉으심으로 이어지는 승귀를 정리합니다. 두 신분은 그리스도의 사역이 낮아짐과 높아짐의 질서 안에서 완성됨을 보여 줍니다.",subtopics:["비하","승귀","부활","승천"],keyPoints:["두 신분","낮아지심","높아지심","구속사의 흐름"],concepts:["비하","승귀","부활","승천"]},
    "IV.4": {summary:"그리스도의 선지자직, 제사장직, 왕직을 통해 중보 사역의 전체성을 설명합니다.",detail:"이 장은 그리스도의 삼중직을 다룹니다. 그리스도가 말씀으로 가르치고, 화목하게 하며, 왕으로 통치하신다는 점에서 구원의 모든 국면을 그리스도께 연결합니다.",subtopics:["선지자직","제사장직","왕직","중보자 사역"],keyPoints:["삼중직","계시와 가르침","화목과 중보","통치와 보호"],concepts:["삼중직","선지자","제사장","왕"]},
    "IV.5": {summary:"속죄의 필요성과 본질을 통해 그리스도의 구속 사역이 무엇을 성취했는지 설명합니다.",detail:"이 장은 죄인을 구원하기 위한 그리스도의 객관적 사역을 다룹니다. 속죄를 단순한 감화나 모범이 아니라 하나님 앞에서 실제로 성취된 구속 사건으로 정리합니다.",subtopics:["속죄의 필요","객관적 속죄","만족","대속"],keyPoints:["속죄의 객관성","구속 성취","하나님의 뜻","죄와 화목"],concepts:["속죄","대속","만족","구속"]},
    "IV.6": {summary:"그리스도의 계속되는 중보 사역과 제사장적 사역을 정리합니다.",detail:"이 장은 그리스도의 사역이 십자가 사건에만 국한되지 않고, 높아지신 주님의 중보와 통치로 계속된다는 점을 다룹니다. 그리스도는 구속을 성취하신 분일 뿐 아니라 그 구속을 자기 백성에게 적용하고 보존하시는 중보자입니다.",subtopics:["중보 사역","대제사장","하늘의 중보","구속 적용"],keyPoints:["계속되는 중보","하늘의 대제사장","구속 적용","그리스도의 현재 사역"],concepts:["중보","대제사장","구속 적용","승귀"]},
    "V.1": {summary:"성령께서 그리스도의 구속을 죄인에게 적용하시는 구원론의 범위를 세웁니다.",detail:"이 장은 구원의 성취와 구원의 적용을 구별합니다. 그리스도께서 이루신 구속이 성령을 통해 각 사람에게 실제로 전달된다는 점에서 구원론을 전개합니다.",subtopics:["구원의 적용","성령의 사역","구속의 복","그리스도와 성령"],keyPoints:["성취와 적용","성령의 역할","구원의 질서","그리스도와의 연합"],concepts:["구원론","성령","구원의 적용","그리스도와의 연합"]},
    "V.2": {summary:"소명과 중생을 통해 하나님이 죄인을 새 생명으로 부르시는 방식을 설명합니다.",detail:"이 장은 외적 부르심과 내적 부르심, 그리고 중생의 창조적 성격을 다룹니다. 중생에서 인간이 스스로 새 생명을 산출하지 않고 하나님의 은혜로 새롭게 된다는 점을 강조합니다.",subtopics:["외적 소명","내적 소명","중생","새 생명"],keyPoints:["효과적 부르심","중생의 수동성","새 창조","은혜의 시작"],concepts:["소명","중생","새 생명","효과적 부르심"]},
    "V.3": {summary:"회심과 믿음을 통해 새 생명이 의식적 응답으로 나타나는 과정을 설명합니다.",detail:"이 장은 회심, 회개, 믿음을 다룹니다. 믿음은 단순한 지적 동의가 아니라 그리스도를 받아들이고 의지하는 전인격적 신뢰입니다.",subtopics:["회심","회개","믿음","그리스도 신뢰"],keyPoints:["회심의 전환","믿음의 성격","회개와 신뢰","구원 적용의 의식적 국면"],concepts:["회심","믿음","회개","신뢰"]},
    "V.4": {summary:"칭의를 법정적 선언으로 설명하며 그리스도의 의가 신자에게 전가됨을 다룹니다.",detail:"이 장은 칭의의 법정적 성격을 정리합니다. 칭의는 인간 내면의 도덕적 변화가 아니라 하나님이 그리스도 안에서 죄인을 의롭다고 선언하시는 은혜의 행위입니다.",subtopics:["법정적 선언","의의 전가","그리스도의 의","죄 사함"],keyPoints:["칭의의 법정성","전가된 의","은혜의 선언","성화와의 구별"],concepts:["칭의","전가","법정적 선언","의"]},
    "V.5": {summary:"성화를 통해 신자의 존재와 삶이 실제로 거룩하게 변화되는 과정을 설명합니다.",detail:"이 장은 칭의와 구별되는 성화의 실제적 변화를 다룹니다. 성화는 하나님께 구별된 삶과 죄에 대한 점진적 승리라는 관점에서 정리됩니다.",subtopics:["거룩함","점진적 변화","죄와의 싸움","새 순종"],keyPoints:["성화의 실제성","칭의와 구별","점진적 갱신","거룩한 삶"],concepts:["성화","거룩","갱신","순종"]},
    "V.6": {summary:"성도의 견인을 통해 하나님이 자기 백성을 끝까지 보존하신다는 교리를 정리합니다.",detail:"이 장은 신자의 구원이 인간의 불안정한 의지에 달려 있지 않고 하나님의 보존하시는 은혜에 근거한다는 점을 다룹니다. 견인 교리는 경건의 나태를 조장하는 것이 아니라 확신과 인내의 근거가 됩니다.",subtopics:["견인","보존","구원의 확신","은혜의 신실성"],keyPoints:["하나님의 보존","성도의 인내","구원의 확신","은혜의 지속성"],concepts:["견인","보존","확신","은혜"]},
    "VI.1": {summary:"교회의 본질과 속성을 통해 교회가 누구이며 무엇인지 설명합니다.",detail:"이 장은 교회를 성도의 무리, 그리스도의 몸, 보이는 교회와 보이지 않는 교회의 관계 속에서 정리합니다. 교회는 단순한 기관이 아니라 그리스도께 속한 백성의 공동체입니다.",subtopics:["교회의 본질","유형 교회","무형 교회","교회의 속성"],keyPoints:["성도의 공동체","그리스도의 몸","가시성과 비가시성","교회의 표지"],concepts:["교회","유형 교회","무형 교회","교회의 속성"]},
    "VI.2": {summary:"교회 정치와 권세를 통해 그리스도께서 교회를 어떻게 다스리시는지 설명합니다.",detail:"이 장은 교회의 통치, 직분, 권세를 다룹니다. 교회의 권세는 자율적 권력이 아니라 그리스도께서 말씀을 통해 교회에 위임하신 봉사적 권위입니다.",subtopics:["교회 정치","직분","교회의 권세","그리스도의 통치"],keyPoints:["그리스도의 머리 되심","개혁파 정치","교회의 권위","직분과 질서"],concepts:["교회 정치","직분","권세","그리스도의 통치"]},
    "VI.3": {summary:"은혜의 방편을 통해 하나님이 말씀과 성례로 자기 백성을 양육하심을 설명합니다.",detail:"이 장은 교회 자체와 은혜의 방편을 구별합니다. 말씀과 성례는 성령께서 신앙을 일으키고 강화하시는 통상적 수단입니다.",subtopics:["은혜의 방편","말씀","성례","성령의 사용"],keyPoints:["말씀과 성례","교회와 방편의 구별","신앙의 강화","성령의 역사"],concepts:["은혜의 방편","말씀","성례","성령"]},
    "VI.4": {summary:"말씀의 사역을 은혜의 방편으로 다루며 설교와 성경의 역할을 설명합니다.",detail:"이 장은 하나님의 말씀이 신앙을 낳고 양육하는 중심 수단임을 다룹니다. 말씀은 단지 정보를 전달하는 매체가 아니라 성령께서 사용하시는 구원의 방편입니다.",subtopics:["말씀의 선포","성경","설교","은혜의 방편"],keyPoints:["말씀의 우선성","설교의 기능","성경의 권위","신앙 형성"],concepts:["말씀","설교","성경","은혜의 방편"]},
    "VI.5": {summary:"성례 일반을 통해 말씀과 함께 주어진 가시적 표와 인의 의미를 설명합니다.",detail:"이 장은 성례가 말씀과 분리된 독립 수단이 아니라 말씀을 보이는 방식으로 확증하는 은혜의 방편임을 설명합니다. 성례는 언약적 표지와 인입니다.",subtopics:["성례의 정의","표와 인","말씀과 성례","언약적 표지"],keyPoints:["가시적 말씀","표와 인","언약의 확인","말씀과의 결합"],concepts:["성례","표","인","언약"]},
    "VI.6": {summary:"세례와 성찬을 통해 신약 교회의 두 성례가 지닌 의미를 정리합니다.",detail:"이 장은 세례와 성찬을 각각 언약 공동체의 표지와 그리스도와의 교제의 표로 설명합니다. 성례는 자동적 효력을 가진 의식이 아니라 믿음 안에서 말씀과 결합해 작용하는 은혜의 방편입니다.",subtopics:["세례","성찬","언약의 표","그리스도와의 교제"],keyPoints:["두 성례","세례의 표지","성찬의 교제","믿음과 말씀"],concepts:["세례","성찬","성례","언약"]},
    "VII.1": {summary:"개인적 종말론을 통해 죽음과 인간의 최종 운명을 다루기 시작합니다.",detail:"이 장은 종말론이 단지 먼 미래의 사건이 아니라 인간 삶의 마지막 문제와 관련되어 있음을 보여 줍니다. 죽음은 존재의 소멸이 아니라 하나님 앞에서 인간의 상태가 전환되는 사건입니다.",subtopics:["개인적 종말론","죽음","영혼의 상태","최종 운명"],keyPoints:["죽음의 신학","존재의 지속","개인적 종말","구원과 심판"],concepts:["종말론","죽음","영혼","최종 운명"]},
    "VII.2": {summary:"죽음과 중간상태를 통해 신자의 죽음 이후 상태와 부활 이전 상태를 설명합니다.",detail:"이 장은 죽음 이후 영혼의 존속과 신자의 복된 상태를 다룹니다. 중간상태는 최종 완성은 아니지만 그리스도 안에 있는 자의 참된 안식으로 이해됩니다.",subtopics:["중간상태","영혼의 존속","신자의 상태","부활 이전"],keyPoints:["죽음 이후 상태","신자의 안식","영혼의 존속","부활 대기"],concepts:["중간상태","영혼","부활","영생"]},
    "VII.3": {summary:"그리스도의 재림을 가시적이고 인격적이며 영광스러운 종말 사건으로 설명합니다.",detail:"이 장은 재림의 확실성과 성격을 정리합니다. 재림은 신앙의 부속 교리가 아니라 구속사의 완성을 여는 중심 사건입니다.",subtopics:["재림의 확실성","가시적 재림","인격적 재림","영광스러운 재림"],keyPoints:["재림의 약속","그리스도의 나타나심","구속사의 완성","종말의 시작"],concepts:["재림","그리스도","종말","구속사"]},
    "VII.4": {summary:"부활과 최후 심판을 통해 그리스도의 재림에 동반되는 보편적 사건을 정리합니다.",detail:"이 장은 몸의 부활과 마지막 심판을 다룹니다. 종말의 구원은 영혼만의 구원이 아니라 몸과 세계를 포함하는 전인적 완성입니다.",subtopics:["몸의 부활","최후 심판","공적 판결","전인적 완성"],keyPoints:["육체의 부활","마지막 심판","공의의 드러남","전인 구원"],concepts:["부활","최후 심판","몸","공의"]},
    "VII.5": {summary:"최종 상태를 통해 새 창조와 영원한 복, 최후의 분리를 설명합니다.",detail:"이 장은 종말론의 결론으로서 새 하늘과 새 땅, 신자의 영원한 복, 불신자의 최종 상태를 다룹니다. 구원의 마지막 목적은 개인의 안식만이 아니라 하나님의 창조 세계의 완성입니다.",subtopics:["최종 상태","새 하늘과 새 땅","영원한 복","최후의 분리"],keyPoints:["새 창조","영원한 복","최종 심판","창조의 완성"],concepts:["최종 상태","새 창조","영생","새 하늘과 새 땅"]}
  };

  function chapterFromString(raw, partTitle) {
    var m = String(raw).match(/^([IVX]+\.\d+)\s+(.+)$/);
    var ref = m ? m[1] : String(raw);
    var title = m ? m[2] : String(raw);
    var profile = chapterProfiles[ref] || {};
    var fallbackConcepts = ["개혁파 정통", "조직신학", "교과서형 교의학"];
    return {
      ref: ref,
      title: title,
      summary: profile.summary || ("벌코프는 『조직신학』 " + ref + "에서 ‘" + title + "’을 개혁파 조직신학의 질서 안에서 정리합니다."),
      detail: profile.detail || ("이 장은 " + partTitle + "에 속합니다. 이 항목은 칼빈의 고전적 진술, 바빙크의 유기적 종합, 바르트의 신정통주의적 재구성과 비교할 때 기준점 역할을 합니다."),
      subtopics: profile.subtopics || [],
      keyPoints: profile.keyPoints || ["개혁파 표준 교리", "교과서형 조직신학", "장별 비교 색인", "바빙크 요약과 교육적 정리"],
      concepts: (profile.concepts || fallbackConcepts).filter(function (v, i, a) { return a.indexOf(v) === i; })
    };
  }

  function buildBerkhofBook(map) {
    if (!map || !Array.isArray(map.parts)) return null;
    return {
      id: "berkhof-systematic-theology",
      title: "조직신학",
      author: "루이스 벌코프",
      originalAuthor: "Louis Berkhof",
      tradition: "개혁파 정통",
      traditionKey: "ref",
      category: "Reformed Systematic Theology / Dogmatics",
      language: "Korean",
      summary: "벌코프의 『조직신학』은 개혁파 교리를 서론, 신론, 인간론, 기독론, 구원론, 교회론, 종말론의 표준 구조로 압축한 대표적 교과서형 조직신학입니다.",
      researchUse: "칼빈과 비교하면 벌코프는 종교개혁 교리의 체계를 교과서적 순서로 정리합니다. 바빙크와 비교하면 더 짧고 명료한 요약형 구조를 제공하며, 바르트와 비교하면 개혁파 정통의 표준 명제와 신정통주의의 계시 중심 재구성을 항목별로 대조하기 좋습니다.",
      topics: ["성경론", "신론", "삼위일체", "창조론", "인간론", "죄론", "기독론", "구원론", "교회론", "성례론", "종말론"],
      authorsMentioned: ["John Calvin", "Herman Bavinck", "Charles Hodge", "A. A. Hodge", "Augustine", "Thomas Aquinas", "Karl Barth"],
      edition: "『조직신학』 구조 한국어 연구색인",
      parts: map.parts.map(function (part) {
        return {
          title: part.title,
          summary: part.summary,
          chapters: (part.chapters || []).map(function (chapter) { return chapterFromString(chapter, part.title); })
        };
      })
    };
  }

  function upsertBook(data, book) {
    if (!data || !Array.isArray(data.books) || !book) return data;
    var replaced = false;
    data.books = data.books.map(function (item) {
      if (item && item.id === book.id) {
        replaced = true;
        return book;
      }
      return item;
    });
    if (!replaced) data.books.push(book);
    return data;
  }

  function completeSentence(text) {
    var t = (text || "").trim();
    if (!t) return "";
    return /[.!?。！？다요임됨함니다습니다]$/.test(t) ? t : t + "입니다.";
  }

  function normalizeBerkhofQuote(quote) {
    return {
      text: completeSentence(quote.textKo || quote.text || ""),
      source: quote.source || "루이스 벌코프, 『조직신학』 한국어판",
      ref: quote.ref || [quote.section, quote.chapter, quote.subtopic].filter(Boolean).join(" — "),
      topic: quote.topic || quote.subtopic || quote.chapter || "조직신학"
    };
  }

  function attachBerkhofQuotes(data, quotePacks) {
    if (!data || !Array.isArray(data.books)) return data;
    var packs = Array.isArray(quotePacks) ? quotePacks : [quotePacks];
    var quotes = [];
    packs.forEach(function (pack) {
      if (pack && Array.isArray(pack.quotes)) quotes = quotes.concat(pack.quotes);
    });
    if (!quotes.length) return data;
    var book = data.books.find(function (item) { return item && item.id === "berkhof-systematic-theology"; });
    if (!book || !Array.isArray(book.parts)) return data;
    quotes = quotes.filter(function (quote) { return quote.book === "berkhof-systematic-theology"; });
    book.parts.forEach(function (part) {
      (part.chapters || []).forEach(function (chapter) {
        var matched = quotes.filter(function (quote) {
          return chapter.ref === quote.section || (quote.ref && quote.ref.indexOf(chapter.ref) === 0);
        });
        if (!matched.length) return;
        var existing = Array.isArray(chapter.quotes) ? chapter.quotes : [];
        var merged = existing.concat(matched.map(normalizeBerkhofQuote));
        var seen = {};
        chapter.quotes = merged.filter(function (item) {
          var key = [item.text, item.ref].join("|");
          if (seen[key]) return false;
          seen[key] = true;
          return true;
        });
      });
    });
    return data;
  }

  var map = loadJson("./data/books-berkhof-structure-map.json", null);
  var book = buildBerkhofBook(map);
  window.__DATA__ = upsertBook(window.__DATA__, book);
  var quotePacks = [
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v1.json", null),
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v2.json", null),
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v3.json", null),
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v4.json", null),
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v5.json", null),
    loadJson("./data/quotes/berkhof-systematic-theology-quotes-v6.json", null)
  ].filter(Boolean);
  window.__DATA__ = attachBerkhofQuotes(window.__DATA__, quotePacks);
})();

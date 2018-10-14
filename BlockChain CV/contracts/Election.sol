pragma solidity ^0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        address id;
        string name;
        string country;
        uint score;
        bytes32[] resume;
    }
    struct Company{
        address id;
        string name;
        string country;
        uint rating;
    }
    struct HR{
        address id;
        string name;
        string company_name;
    }
    mapping(bytes32 => bool) private hashTable;
    mapping(address => Company) public companies;
    mapping(address => HR) public HRs;
    // Store accounts that have voted
    mapping(address => string) public registerList;
    mapping(uint => Company) public companyList;
    mapping(uint => Candidate) public candidateList;
    mapping(uint => HR) public HRList;
    // Store Candidates
    // Fetch Candidate
    mapping(address => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    uint public companiesCount;
    uint public HRCount;
    // voted event
    event votedEvent (
        uint indexed _candidateId
    );
    function stringsEqual(string storage _a, string memory _b) internal returns (bool) {
        bytes storage a = bytes(_a);
        bytes memory b = bytes(_b);
        if (a.length != b.length)
            return false;
        // @todo unroll this loop
        for (uint i = 0; i < a.length; i ++)
            if (a[i] != b[i])
                return false;
        return true;
    }
    function Election () public {
        address c1 = 0xe1e666DADF9F3D76492Fab543CD9679d665399eB;
        initCompany(c1,'Didi','China');
        address c2 = 0x502f0E47F460E9720AA343dCffb02A551C4de08d;
        initCompany(c2,'Google','USA');
        address h1 = 0x677Cc014c2aB64c4cF5BB19dfc13cBB15E078256;
        initHR(h1,'Cathy','Google');
        address e1 = 0xd401FEa5a5980c204885C7BA58145218977227F7;
        bytes32[] r1;
        initCandidate(e1,'Jon Snow', 'China');
    }
    function initCandidate (address a, string _name, string _country) public {
        bytes32[] x;
        candidates[a] = Candidate(a, _name,_country,60,x);
        registerList[a] = 'Candidate';
        candidatesCount++;
        candidateList[candidatesCount] = candidates[a];
    }

    function initCompany (address a,string _name, string _country) public {
        companies[a] = Company(msg.sender, _name,_country,0);
        registerList[a] = 'Company';
        companiesCount++;
        companyList[companiesCount] = companies[a];
    }
    function initHR (address a,string _name, string company) public {
        HRs[a] = HR(a, _name,company);
        registerList[a] = 'HR';
        HRCount++;
        HRList[HRCount] = HRs[a];
    }
    function addCandidate (string _name, string _country) public {
        //require(!registerList[msg.sender]);
        bytes32[] memory x;
        candidates[msg.sender] = Candidate(msg.sender, _name,_country,60,x);
        registerList[msg.sender] = "Candidate";
        candidatesCount++;
        candidateList[candidatesCount] = candidates[msg.sender];
    }

    function addCompany (string _name, string _country) public {
        companies[msg.sender] = Company(msg.sender, _name,_country,0);
        registerList[msg.sender] = "Company";
        companiesCount++;
        companyList[companiesCount] = companies[msg.sender];
    }
    function addHR (string _name, string company) public {
        HRs[msg.sender] = HR(msg.sender, _name,company);
        registerList[msg.sender] = "HR";
        HRCount++;
        HRList[HRCount] = HRs[msg.sender];
    }

    function verify (uint _candidateId) public {
        // require that they haven't voted before

        require(stringsEqual(registerList[msg.sender] , 'Company'));
        var tasks = "Jon Snow has been working in Didi for two years";
        bytes32 hash = keccak256(abi.encodePacked(tasks));
        hashTable[hash] = true;
        var candidate = candidateList[_candidateId];
        candidate.resume.push(hash);
        require(candidate.resume.length >= 1);




    }
    function Rate (uint _companyId) public {
        require(stringsEqual(registerList[msg.sender] , 'Candidate'));
        var company = companyList[_companyId];
        company.rating ++;



    }
    function check (uint employee) public {
        require(stringsEqual(registerList[msg.sender] , "HR"));
        var resume = candidateList[employee].resume; 
        bool checked = true;
        for (uint i=0; i<resume.length; i++) {
            checked = checked && hashTable[resume[i]];
    }
        //return checked;
    }
}

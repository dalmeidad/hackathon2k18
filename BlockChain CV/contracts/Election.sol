pragma solidity ^0.4.2;

contract Election {
    // Model a Candidate
    struct Candidate {
        address id;
        string name;
        string country;
        bytes32[] resume;
        uint score;
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
    mapping(address => bool) public registerList;
    mapping(address => bool) public companyList;
    // Store Candidates
    // Fetch Candidate
    mapping(address => Candidate) public candidates;
    // Store Candidates Count
    uint public candidatesCount;
    uint public companiesCount;
    // voted event
    event votedEvent (
        uint indexed _candidateId
    );

    function Election () public {

    }

    function addCandidate (string _name, string _country) public {
        //require(!registerList[msg.sender]);
        bytes32[] x;
        candidates[msg.sender] = Candidate(msg.sender, _name,_country,x,0);
        registerList[msg.sender] == true;
        candidatesCount++;
    }

    function addCompany (string _name, string _country) public {
        require(!registerList[msg.sender]);
        companies[msg.sender] = Company(msg.sender, _name,_country,0);
        registerList[msg.sender] == true;
        companyList[msg.sender] == true;
    }
    function addHR (string _name, string company) public {
        require(!registerList[msg.sender]);
        HRs[msg.sender] = HR(msg.sender, _name,company);
        registerList[msg.sender] == true;
    }

    function request (string tasks) public {
        // require that they haven't voted before
        require(registerList[msg.sender]);
        



    }
    function verify (address _candidateId,string tasks) public {
        // require that they haven't voted before
        require(registerList[msg.sender]);
        require(registerList[_candidateId]);
        require(companyList[msg.sender]);
        bytes32 hash = keccak256(tasks);
        hashTable[hash] = true;
        var candidate = candidates[_candidateId];
        candidate.resume.push(hash);




        // update candidate vote Co
    }
    function check (address employee) public {
        require(registerList[employee]);
        require(registerList[msg.sender]);
        var resume = candidates[employee].resume; 
        bool checked = true;
        for (uint i=0; i<resume.length; i++) {
            checked = checked && hashTable[resume[i]];
    }
        //return checked;
    }
}

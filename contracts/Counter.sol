pragma solidity >0.6.0 <0.8.0;

contract Counter {
    uint256 _count;

    constructor() public {
        _count = 0;
    }

    function count() external view returns (uint256)
    {
        return _count;
    }

    function countUp() external returns (bool)
    {
        _count = _count + 1;
        require(_count != 0, "count too high!");
        emit CountChanged(msg.sender, _count);
        return true;
    }

    function countDown() external returns (bool)
    {
        require(_count > 0, "count too low!");
        _count = _count - 1;
        emit CountChanged(msg.sender, _count);
        return true;
    }

    function setCount(uint newCount) external returns (bool)
    {
        _count = newCount;
        emit CountChanged(msg.sender, _count);
        return true;
    }

    event CountChanged(
        address indexed caller,
        uint256 count
    );
}

using Microsoft.AspNetCore.Mvc;
using Hongsa.Rtms.Api.Models;

namespace Hongsa.Rtms.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserCompleteController: ControllerBase
{
    [HttpGet]
    public String GetUser()
    {
        return "Hello User";
    }

    [HttpGet ("welcome")]
    public String WelcomeUser()
    {
        return "Welcome User";
    }

    [HttpPost]
    public String PostUser()
    {
        return "User Posted";
    }

    [HttpPut]
    public String UpdateUser()
    {
        return "User Updated";
    }

    [HttpDelete]
    public String DeleteUser()
    {
        return "User Deleted";
    }
}
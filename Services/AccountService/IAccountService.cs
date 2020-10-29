namespace CovidRequest.Services.AccountService
{
    public interface IAccountService
    {
        string Authenticate(long id, string email, string role = "");
        string GetHashString(string password);
    }
}
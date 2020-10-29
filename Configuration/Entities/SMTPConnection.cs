namespace CovidRequest.Configuration.Entities
{
    public class SMTPConnection
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
    }
}
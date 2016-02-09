using System.Linq;
using Breeze.ContextProvider;
using CodeCamper.Da;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;

namespace CodeCamper.Controllers
{
    public interface ICodeCamperController
    {
        IQueryable<Attendance> Attendances();
        object Lookups(string separatedNames);
        string Metadata();
        IQueryable<Person> Persons();
        IQueryable<Room> Rooms();
        SaveResult SaveChanges(JObject saveBundle);
        IQueryable<Session> Sessions();
        IQueryable<TimeSlot> TimeSlots();
        IQueryable<KeyValuePair<int, int>> TopSpeakers();
        IQueryable<Track> Tracks();
    }
}
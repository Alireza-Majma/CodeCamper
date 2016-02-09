using CodeCamper.Da;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da
{
    public class TimeSlotMap : ClassMap<TimeSlot>
    {
        public TimeSlotMap()
        {
            Table("TimeSlot");
            Id(x => x.Id);
            Map(x => x.Start);
            Map(x => x.IsSessionSlot);
            Map(x => x.Duration);
        }

    }
}

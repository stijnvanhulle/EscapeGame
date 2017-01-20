using System;


namespace Estimotes {

    public class BeaconRegion {

        public string Uuid { get; }
        public string Identifier { get; }
        public ushort? Major { get; }
        public ushort? Minor { get; }


		public BeaconRegion(string identifier, string uuid, ushort? major = null, ushort? minor = null) {
            this.Identifier = identifier;
            this.Uuid = uuid;
            this.Major = major;
            this.Minor = minor;
        }


        public override string ToString() {
            return $"[UUID: {this.Uuid} - Identifier: {this.Identifier} - Major: {this.Major ?? 0} - Minor: {this.Minor ?? 0}]";
        }


        public override bool Equals(object obj) {
            var other = obj as BeaconRegion;
            if (other == null)
                return false;

			if (ReferenceEquals(this, other))
				return true;

			if (!this.Uuid.Equals(other.Uuid, StringComparison.OrdinalIgnoreCase))
                return false;

            if (this.Major != other.Major)
                return false;

            if (this.Minor != other.Minor)
                return false;

            return true;
        }


        public override int GetHashCode() {
			var hash = this.Uuid.GetHashCode() + this.Identifier.GetHashCode();
			if (this.Major != null)
				hash += this.Major.Value.GetHashCode();

			if (this.Minor != null)
				hash += this.Minor.Value.GetHashCode();

            return hash;
        }
    }
}
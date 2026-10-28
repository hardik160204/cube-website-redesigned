-- Changes on 28 Oct 2026: admin second factor moved from emailed codes to an authenticator app (TOTP);
-- a protected owner (master admin) whose ownership can only move via transfer_owner(); image spot sizes.
-- Safe to run more than once. (The server also applies these on start-up.)

-- Authenticator secret (encrypted) and the pending enrolment secret during sign-in.
ALTER TABLE admins ADD COLUMN IF NOT EXISTS totp_secret text;
ALTER TABLE login_challenges ADD COLUMN IF NOT EXISTS pending_secret text;

-- Owner (master admin): first admin, can't be removed or demoted; ownership moves only via transfer_owner().
ALTER TABLE admins ADD COLUMN IF NOT EXISTS is_owner boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS admins_one_owner ON admins (is_owner) WHERE is_owner;
UPDATE admins SET is_owner = true
  WHERE id = (SELECT min(id) FROM admins) AND NOT EXISTS (SELECT 1 FROM admins WHERE is_owner);

CREATE OR REPLACE FUNCTION protect_owner_admin() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'DELETE' AND OLD.is_owner THEN
    RAISE EXCEPTION 'The owner admin cannot be removed';
  END IF;
  IF TG_OP = 'UPDATE' AND OLD.is_owner AND NOT NEW.is_owner
     AND coalesce(current_setting('cube.owner_transfer', true), '') <> 'on' THEN
    RAISE EXCEPTION 'Ownership cannot be removed';
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;
DROP TRIGGER IF EXISTS admins_protect_owner ON admins;
CREATE TRIGGER admins_protect_owner BEFORE DELETE OR UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION protect_owner_admin();

CREATE OR REPLACE FUNCTION transfer_owner(new_owner integer) RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins WHERE id = new_owner) THEN
    RAISE EXCEPTION 'No admin with id %', new_owner;
  END IF;
  PERFORM set_config('cube.owner_transfer', 'on', true);
  UPDATE admins SET is_owner = false WHERE is_owner AND id <> new_owner;
  UPDATE admins SET is_owner = true WHERE id = new_owner;
  PERFORM set_config('cube.owner_transfer', 'off', true);
END $$;
REVOKE ALL ON FUNCTION transfer_owner(integer) FROM PUBLIC;

-- Image spot sizes for the visual editor.
ALTER TABLE overrides ADD COLUMN IF NOT EXISTS width integer NOT NULL DEFAULT 0;
ALTER TABLE overrides ADD COLUMN IF NOT EXISTS height integer NOT NULL DEFAULT 0;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON FUNCTION transfer_owner(integer), protect_owner_admin() FROM anon, authenticated;
  END IF;
END $$;

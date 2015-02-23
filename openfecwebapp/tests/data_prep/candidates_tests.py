from flask import Flask
from flask.ext.testing import TestCase
from openfecwebapp.data_prep.candidates import *
from openfecwebapp.tests.mock_data import candidate

class TestDataMappings(TestCase):

    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True

        @app.route('/candidates')
        def candidates():
            pass

        @app.route('/committees/<c_id>')
        def committee_page():
            pass

        return app

    def test_map_candidate_page_values(self):
        vals = map_candidate_page_values(candidate)

        self.assertTrue(vals['related_committees'])
        self.assertEqual(vals['state'], 'TN')
        self.assertEqual(vals['name'], 'Person McPersonson')
        self.assertEqual('challenger', vals['incumbent_challenge'])
        self.assertEqual('D1234', vals['primary_committee']['id'])
        self.assertEqual('Friends of McPersonson', 
            vals['primary_committee']['name'])
        self.assertEqual('/committees/D1234',
            vals['primary_committee']['url'])

        self.assertEqual('D1234', vals['affiliated_committees'][
            'D1234']['id'])
        self.assertEqual('Friends of McPersonson', 
            vals['affiliated_committees']['D1234']['name'])
        self.assertEqual('Authorized',
            vals['affiliated_committees']['D1234']['designation'])
        self.assertEqual('/committees/D1234',
            vals['affiliated_committees']['D1234']['url'])

    def test_map_candidate_table_values(self):
        vals = map_candidate_table_values(candidate)

        self.assertEqual(vals['name'], 'Person McPersonson')
        self.assertEqual(vals['office'], 'Supreme Ruler')
        self.assertEqual(vals['election'], 2012)
        self.assertEqual(vals['party'], 'Cool People')
        self.assertEqual(vals['state'], 'TN')
        self.assertEqual(vals['district'], 11)
        self.assertEqual(vals['id'], 'A12345')

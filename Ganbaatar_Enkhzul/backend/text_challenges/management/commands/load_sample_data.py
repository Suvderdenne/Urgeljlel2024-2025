from django.core.management.base import BaseCommand
from text_challenges.models import Language, TextChallenge


class Command(BaseCommand):
    help = 'Loads sample data for languages and text challenges'

    def handle(self, *args, **options):
        # Create languages
        self.stdout.write('Creating languages...')
        languages = [
            {'language_code': 'en', 'language_name': 'English', 'is_active': True},
            {'language_code': 'es', 'language_name': 'Spanish', 'is_active': True},
            {'language_code': 'fr', 'language_name': 'French', 'is_active': True},
            {'language_code': 'de', 'language_name': 'German', 'is_active': True},
            {'language_code': 'zh', 'language_name': 'Chinese', 'is_active': False},
            {'language_code': 'mn', 'language_name': 'Mongolian', 'is_active': True},
        ]
        
        for lang_data in languages:
            Language.objects.get_or_create(
                language_code=lang_data['language_code'],
                defaults={
                    'language_name': lang_data['language_name'],
                    'is_active': lang_data['is_active']
                }
            )

        # Create text challenges
        self.stdout.write('Creating text challenges...')
        
        # Sample English challenges
        en_language = Language.objects.get(language_code='en')
        
        # Easy challenge
        TextChallenge.objects.get_or_create(
            challenge_id=1,
            defaults={
                'difficulty_level': 'EASY',
                'language': en_language,
                'recommended_time': 1,
                'content': 'The quick brown fox jumps over the lazy dog. This pangram contains all the letters of the English alphabet.',
                'word_count': 16
            }
        )
        
        # Medium challenge
        TextChallenge.objects.get_or_create(
            challenge_id=2,
            defaults={
                'difficulty_level': 'MEDIUM',
                'language': en_language,
                'recommended_time': 2,
                'content': 'Programming is the process of creating a set of instructions that tell a computer how to perform a task. Programming can be done using a variety of computer programming languages, such as JavaScript, Python, and C++.',
                'word_count': 32
            }
        )
        
        # Hard challenge
        TextChallenge.objects.get_or_create(
            challenge_id=3,
            defaults={
                'difficulty_level': 'HARD',
                'language': en_language,
                'recommended_time': 5,
                'content': 'Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to intelligence displayed by animals or humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term "artificial intelligence" had previously been used to describe machines that mimic human cognitive skills that are associated with the human mind, such as learning and problem-solving.',
                'word_count': 79
            }
        )
        
        # Sample Spanish challenge
        es_language = Language.objects.get(language_code='es')
        TextChallenge.objects.get_or_create(
            challenge_id=4,
            defaults={
                'difficulty_level': 'MEDIUM',
                'language': es_language,
                'recommended_time': 3,
                'content': 'El veloz zorro marrón salta sobre el perro perezoso. Esta frase contiene todas las letras del alfabeto español.',
                'word_count': 17
            }
        )
        
        # Mongolian challenges
        mn_language = Language.objects.get(language_code='mn')
        
        # Easy challenge
        TextChallenge.objects.get_or_create(
            challenge_id=5,
            defaults={
                'difficulty_level': 'EASY',
                'language': mn_language,
                'recommended_time': 2,
                'content': 'Хурдан хүрэн үнэг залхуу нохойн дээгүүр үсэрдэг. Энэ өгүүлбэр монгол цагаан толгойн бүх үсгийг агуулдаг.',
                'word_count': 15
            }
        )
        
        # Medium challenge
        TextChallenge.objects.get_or_create(
            challenge_id=6,
            defaults={
                'difficulty_level': 'MEDIUM',
                'language': mn_language,
                'recommended_time': 3,
                'content': 'Програмчлал гэдэг нь компьютерт хэрхэн ажиллах талаар зааварчилгаа өгөх үйл явц юм. Програмчлалыг JavaScript, Python, C++ зэрэг олон төрлийн компьютерийн програмчлалын хэл ашиглан хийж болно.',
                'word_count': 28
            }
        )
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded sample data')) 